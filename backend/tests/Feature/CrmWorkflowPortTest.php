<?php

namespace Tests\Feature;

use App\Models\Certificate;
use App\Models\Investment;
use App\Models\Poll;
use App\Models\PollVote;
use App\Models\Project;
use App\Models\ReferralCommission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Advanced CRM workflow port (from bridging-investments static demo):
 * deadlines, ownership/certificates/statements, polls, referral commissions.
 */
class CrmWorkflowPortTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $investor;
    private string $adminToken;
    private string $investorToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->admin = User::where('email', 'admin@ownstakex.com')->firstOrFail();
        $this->investor = User::where('email', 'investor@ownstakex.com')->firstOrFail();
        $this->adminToken = $this->admin->createToken('test')->plainTextToken;
        $this->investorToken = $this->investor->createToken('test')->plainTextToken;
    }

    /* ---------------- deadlines ---------------- */

    public function test_admin_deadlines_list_returns_severity_bands(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/v1/admin/deadlines');

        $response->assertOk();
        $items = $response->json();
        $this->assertCount(4, $items);

        $byCode = collect($items)->keyBy('code');
        $this->assertSame('normal', $byCode['OX-YT-01']['severity']['key']);   // ~40d
        $this->assertSame('attention', $byCode['OX-PR-02']['severity']['key']); // ~12d
        $this->assertSame('urgent', $byCode['OX-HS-03']['severity']['key']);    // ~5d
        $this->assertSame('critical', $byCode['OX-FD-04']['severity']['key']); // ~2d

        $this->assertArrayHasKey('extension_history', $byCode['OX-YT-01']);
        $this->assertSame(0, $byCode['OX-YT-01']['extension_count']);
    }

    public function test_investor_cannot_see_deadlines(): void
    {
        $this->withToken($this->investorToken)
            ->getJson('/api/v1/admin/deadlines')
            ->assertForbidden();
    }

    public function test_extend_closing_preserves_original_date(): void
    {
        $project = Project::where('code', 'OX-YT-01')->firstOrFail();
        $originalClosing = $project->closing_date->toDateTimeString();

        $response = $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/projects/{$project->id}/extend-closing", ['days' => 10]);

        $response->assertOk();
        $project->refresh();

        $this->assertSame($originalClosing, $project->closing_original_date->toDateTimeString());
        $this->assertSame(
            now()->addDays(50)->toDateTimeString(),
            $project->closing_date->toDateTimeString()
        );
        $history = $project->extension_history;
        $this->assertCount(1, $history);
        $this->assertSame('Sara Iqbal', $history[0]['by']);
        $this->assertSame($originalClosing, $history[0]['from']);

        // Second extension must not overwrite the original date.
        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/projects/{$project->id}/extend-closing", ['days' => 5])
            ->assertOk();
        $project->refresh();
        $this->assertSame($originalClosing, $project->closing_original_date->toDateTimeString());
        $this->assertCount(2, $project->extension_history);
    }

    public function test_extend_closing_validates_days_range(): void
    {
        $project = Project::where('code', 'OX-YT-01')->firstOrFail();

        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/projects/{$project->id}/extend-closing", ['days' => 0])
            ->assertUnprocessable();

        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/projects/{$project->id}/extend-closing", ['days' => 91])
            ->assertUnprocessable();
    }

    /* ---------------- ownership / certificates / statements ---------------- */

    public function test_investor_ownership_lists_holdings_with_certificates(): void
    {
        $response = $this->withToken($this->investorToken)
            ->getJson('/api/v1/my/ownership');

        $response->assertOk();
        $items = $response->json();
        $this->assertGreaterThanOrEqual(2, count($items));

        $property = collect($items)->firstWhere('project.code', 'OX-PR-02');
        $this->assertNotNull($property);
        $this->assertSame('CRT-2026-0912', $property['certificate']['cert_no']);
        $this->assertEquals(round(4 / 240 * 100, 2), $property['ownership_pct']);
    }

    public function test_certificate_payload_and_ownership_guard(): void
    {
        $cert = Certificate::where('cert_no', 'CRT-2026-0912')->firstOrFail();

        $response = $this->withToken($this->investorToken)
            ->getJson("/api/v1/my/certificates/{$cert->id}");

        $response->assertOk();
        $json = $response->json();
        $this->assertSame('Ahmed Khan', $json['holder_name']);
        $this->assertSame('CRT-2026-0912', $json['cert_no']);
        $this->assertSame('REG-OX-PR-02-2026', $json['register_ref']);
        $this->assertNotEmpty($json['disclaimer']);
        $this->assertNotEmpty($json['acquired_at']);

        // Another user must be refused — verified in a separate test so the
        // authenticated user is not cached across requests by Sanctum's guard.
    }

    public function test_certificate_refused_for_other_user(): void
    {
        $cert = Certificate::where('cert_no', 'CRT-2026-0912')->firstOrFail();

        $other = User::create([
            'name' => 'Stranger', 'email' => 'stranger@example.com',
            'password' => 'password', 'role' => 'investor',
        ]);

        $this->withToken($other->createToken('test')->plainTextToken)
            ->getJson("/api/v1/my/certificates/{$cert->id}")
            ->assertForbidden();
    }

    public function test_investor_statements_list(): void
    {
        $response = $this->withToken($this->investorToken)
            ->getJson('/api/v1/my/statements');

        $response->assertOk();
        $items = $response->json();
        $this->assertCount(1, $items);
        $this->assertSame('Q3 2026', $items[0]['period']);
        $this->assertSame('OX-PR-02', $items[0]['investment']['project']['code']);
    }

    /* ---------------- polls ---------------- */

    public function test_poll_list_vote_and_double_vote_conflict(): void
    {
        $poll = Poll::firstOrFail();

        $list = $this->withToken($this->investorToken)->getJson('/api/v1/polls');
        $list->assertOk();
        $item = collect($list->json())->firstWhere('id', $poll->id);
        $this->assertNotNull($item);
        $this->assertNull($item['my_vote']);
        $this->assertSame('OX-YT-01', $item['project']['code']);

        $vote = $this->withToken($this->investorToken)
            ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_index' => 1]);
        $vote->assertCreated();

        $this->withToken($this->investorToken)
            ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_index' => 0])
            ->assertStatus(409);

        $list2 = $this->withToken($this->investorToken)->getJson('/api/v1/polls');
        $item2 = collect($list2->json())->firstWhere('id', $poll->id);
        $this->assertSame(1, $item2['my_vote']);
        $this->assertSame([0, 1, 0], array_values($item2['votes_count']));
    }

    public function test_vote_rejects_bad_option_and_closed_poll(): void
    {
        $poll = Poll::firstOrFail();

        $this->withToken($this->investorToken)
            ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_index' => 9])
            ->assertUnprocessable();

        $poll->update(['closes_at' => now()->subMinute()]);
        $this->withToken($this->investorToken)
            ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_index' => 0])
            ->assertUnprocessable();
    }

    /* ---------------- referral commissions ---------------- */

    public function test_commission_pipeline_transitions_and_guards(): void
    {
        // Full pipeline on a fresh accrued commission tied to a funded investment.
        $funded = Investment::where('status', 'funded')->firstOrFail();
        $commission = ReferralCommission::create([
            'referrer_id' => $this->admin->id,
            'referred_investment_id' => $funded->id,
            'amount_cents' => 100000,
            'status' => 'accrued',
        ]);

        $list = $this->withToken($this->adminToken)
            ->getJson('/api/v1/admin/referral-commissions');
        $list->assertOk();
        $this->assertSame('Sara Iqbal', $list->json('data.0.referrer.name'));

        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$commission->id}/approve")
            ->assertOk();

        // Re-approve must fail: invalid transition.
        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$commission->id}/approve")
            ->assertUnprocessable();

        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$commission->id}/mark-payable")
            ->assertOk();

        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$commission->id}/mark-paid")
            ->assertOk();

        $commission->refresh();
        $this->assertSame('paid', $commission->status);
        $this->assertNotNull($commission->settled_at);

        // Paid is terminal.
        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$commission->id}/mark-paid")
            ->assertUnprocessable();
    }

    public function test_mark_payable_requires_settled_funding(): void
    {
        $accrued = ReferralCommission::where('status', 'accrued')->firstOrFail();

        $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$accrued->id}/approve")
            ->assertOk();

        $response = $this->withToken($this->adminToken)
            ->postJson("/api/v1/admin/referral-commissions/{$accrued->id}/mark-payable");

        $response->assertUnprocessable()
            ->assertJson(['message' => 'Commission becomes payable only after funding settlement.']);
    }

    public function test_non_admin_cannot_touch_commissions(): void
    {
        $this->withToken($this->investorToken)
            ->getJson('/api/v1/admin/referral-commissions')
            ->assertForbidden();
    }

    /* ---------------- deadline accessor ---------------- */

    public function test_project_deadline_accessor_matches_demo_bands(): void
    {
        $project = Project::where('code', 'OX-FD-04')->firstOrFail();
        $deadline = $project->deadline;

        $this->assertSame('critical', $deadline['key']);
        $this->assertSame('Critical', $deadline['label']);
        $this->assertGreaterThan(0, $deadline['days_left']);
    }
}
