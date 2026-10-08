<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\BlogPost;
use App\Models\Certificate;
use App\Models\Distribution;
use App\Models\Document;
use App\Models\Investment;
use App\Models\Payment;
use App\Models\Poll;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\ReferralCommission;
use App\Models\Reservation;
use App\Models\Statement;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the OwnStakeX demo dataset.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Sara Iqbal',
            'email' => 'admin@ownstakex.com',
            'password' => 'password',
            'role' => 'admin',
            'phone' => '+971500000001',
            'country' => 'UAE',
            'kyc_status' => 'approved',
        ]);

        $investor = User::create([
            'name' => 'Ahmed Khan',
            'email' => 'investor@ownstakex.com',
            'password' => 'password',
            'role' => 'investor',
            'phone' => '+971500000002',
            'country' => 'UAE',
            'kyc_status' => 'approved',
        ]);

        $projects = [
            [
                'code' => 'OX-YT-01',
                'name' => 'Dubai Charter Yacht',
                'slug' => 'dubai-charter-yacht',
                'category' => 'Yachts & Marine',
                'location' => 'Dubai Marina, UAE',
                'tagline' => '88-ft luxury charter yacht with established booking demand',
                'description' => 'A fully crewed 88-ft luxury motor yacht operating day and term charters from Dubai Marina. Revenue comes from charter bookings and seasonal events, with quarterly distributions to unit holders.',
                'capital' => 4800000,
                'units' => 96,
                'unit_price' => 50000,
                'min_units' => 1,
                'max_units' => 10,
                'reserved' => 34,
                'funded' => 44,
                'status' => 'funding',
                'version' => 'v1.2',
                'campaign_ends' => '2026-11-05',
                'long_stop' => '2027-02-28',
                'operator' => 'Marina Charter Co.',
                'issuer' => 'OwnStakeX Yacht SPV 1 Ltd',
                'cover_image' => 'assets/cat-yachts.jpg',
                'video_url' => null,
            ],
            [
                'code' => 'OX-PR-02',
                'name' => 'Business Bay Commercial Tower',
                'slug' => 'business-bay-commercial-tower',
                'category' => 'Real Estate',
                'location' => 'Business Bay, Dubai, UAE',
                'tagline' => 'Grade-A office floors with long-term corporate tenants',
                'description' => 'Two fully fitted office floors in a Business Bay commercial tower, leased to corporate tenants on multi-year contracts. Rental income is distributed quarterly after service charges.',
                'capital' => 12000000,
                'units' => 240,
                'unit_price' => 50000,
                'min_units' => 1,
                'max_units' => 20,
                'reserved' => 80,
                'funded' => 141,
                'status' => 'funding',
                'version' => 'v1.0',
                'campaign_ends' => '2026-12-15',
                'long_stop' => '2027-03-31',
                'operator' => 'Bay Property Management LLC',
                'issuer' => 'OwnStakeX Property SPV 2 Ltd',
                'cover_image' => 'assets/cat-real-estate.jpg',
                'video_url' => null,
            ],
            [
                'code' => 'OX-HS-03',
                'name' => 'JBR Beachfront Restaurant',
                'slug' => 'jbr-beachfront-restaurant',
                'category' => 'Hospitality',
                'location' => 'JBR, Dubai, UAE',
                'tagline' => 'High-footfall beachfront dining venue under evaluation',
                'description' => 'A 220-cover beachfront restaurant on JBR Walk. Currently in evaluation: the investment committee is reviewing footfall data, the operator track record and the fit-out budget before a funding decision.',
                'capital' => 3600000,
                'units' => 120,
                'unit_price' => 30000,
                'min_units' => 1,
                'max_units' => 12,
                'reserved' => 0,
                'funded' => 0,
                'status' => 'evaluation',
                'version' => 'v0.9',
                'campaign_ends' => null,
                'long_stop' => null,
                'operator' => 'Coastal Hospitality Group',
                'issuer' => 'OwnStakeX Hospitality SPV 3 Ltd',
                'cover_image' => 'assets/cat-hospitality.jpg',
                'video_url' => null,
            ],
            [
                'code' => 'OX-FD-04',
                'name' => 'Falcon SME Growth Fund',
                'slug' => 'falcon-sme-growth-fund',
                'category' => 'Operating Businesses',
                'location' => 'Dubai, UAE',
                'tagline' => 'Diversified pool of profitable UAE small businesses',
                'description' => 'A diversified holding of profitable UAE SMEs across logistics, food services and business services. The fund targets quarterly distributions from operating cash flows. Not an approved product — subscriptions are never trader deposits.',
                'capital' => 8000000,
                'units' => 160,
                'unit_price' => 50000,
                'min_units' => 1,
                'max_units' => 16,
                'reserved' => 20,
                'funded' => 60,
                'status' => 'funding',
                'version' => 'v1.0',
                'campaign_ends' => '2026-11-30',
                'long_stop' => '2027-02-28',
                'operator' => 'Falcon Capital Partners',
                'issuer' => 'OwnStakeX Falcon SPV 4 Ltd',
                'cover_image' => 'assets/cat-business.jpg',
                'video_url' => null,
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::create($data);

            ProjectImage::create([
                'project_id' => $project->id,
                'url' => $project->cover_image,
                'sort_order' => 0,
            ]);
        }

        // Advanced CRM workflow demo values (mirrors bridging-investments/js/data.js).
        $deadlineSeed = [
            'OX-YT-01' => ['days' => 40, 'held' => 8],
            'OX-PR-02' => ['days' => 12, 'held' => 5],
            'OX-HS-03' => ['days' => 5, 'held' => 0],
            'OX-FD-04' => ['days' => 2, 'held' => 3],
        ];
        foreach ($deadlineSeed as $code => $seed) {
            $closing = now()->addDays($seed['days']);
            Project::where('code', $code)->update([
                'closing_date' => $closing,
                'closing_original_date' => $closing,
                'extension_history' => [],
                'held_units' => $seed['held'],
            ]);
        }

        $yacht = Project::where('code', 'OX-YT-01')->first();
        $property = Project::where('code', 'OX-PR-02')->first();

        Document::create([
            'title' => 'Offering terms — Yacht v1.2',
            'category' => 'Offering',
            'file_url' => 'docs/yacht-offering-terms-v1-2.pdf',
            'file_size' => '2.1 MB',
            'mime' => 'application/pdf',
            'audience' => 'investors',
            'project_id' => $yacht->id,
            'version' => 'v1.2',
        ]);

        Document::create([
            'title' => 'Offering terms — Property v1.0',
            'category' => 'Offering',
            'file_url' => 'docs/property-offering-terms-v1-0.pdf',
            'file_size' => '2.4 MB',
            'mime' => 'application/pdf',
            'audience' => 'investors',
            'project_id' => $property->id,
            'version' => 'v1.0',
        ]);

        Document::create([
            'title' => 'August 2026 monthly report — Property',
            'category' => 'Reporting',
            'file_url' => 'docs/monthly-report-aug-2026-property.pdf',
            'file_size' => '1.6 MB',
            'mime' => 'application/pdf',
            'audience' => 'investors',
            'project_id' => $property->id,
            'version' => null,
        ]);

        $reservation = Reservation::create([
            'user_id' => $investor->id,
            'project_id' => $yacht->id,
            'units' => 2,
            'unit_price' => $yacht->unit_price,
            'status' => 'confirmed',
        ]);

        $investment = Investment::create([
            'user_id' => $investor->id,
            'project_id' => $property->id,
            'units' => 4,
            'amount' => 4 * $property->unit_price,
            'status' => 'active',
            'certificate_no' => 'CRT-2026-0912',
        ]);

        Payment::create([
            'user_id' => $investor->id,
            'investment_id' => $investment->id,
            'amount' => $investment->amount,
            'method' => 'bank_transfer',
            'status' => 'completed',
            'reference' => 'PAY-2026-0841',
        ]);

        Distribution::create([
            'project_id' => $property->id,
            'amount' => 8600,
            'per_unit' => 35.83,
            'note' => 'Q3 2026 rental distribution (demo)',
            'paid_at' => now()->subDays(20),
        ]);

        // Advanced CRM workflow seed: a second investment for the investor (yacht),
        // a funded investment (for commission settlement), certificates, a poll,
        // a holding statement, and referral commissions across the full pipeline.
        $investment2 = Investment::create([
            'user_id' => $investor->id,
            'project_id' => $yacht->id,
            'units' => 8,
            'amount' => 8 * $yacht->unit_price,
            'status' => 'active',
            'certificate_no' => 'CRT-2026-0877',
        ]);

        $fundedInvestment = Investment::create([
            'user_id' => $investor->id,
            'project_id' => $yacht->id,
            'units' => 2,
            'amount' => 2 * $yacht->unit_price,
            'status' => 'funded',
            'certificate_no' => null,
        ]);

        Certificate::create([
            'investment_id' => $investment->id,
            'cert_no' => 'CRT-2026-0912',
            'issued_at' => now()->subDays(48),
        ]);

        Certificate::create([
            'investment_id' => $investment2->id,
            'cert_no' => 'CRT-2026-0877',
            'issued_at' => now()->subDays(33),
        ]);

        Poll::create([
            'project_id' => $yacht->id,
            'question' => 'Should the operator proceed with the Q4 refit schedule?',
            'options' => ['Approve the refit plan', 'Defer to Q1 2027', 'Request revised quote'],
            'closes_at' => now()->addDays(12),
        ]);

        Statement::create([
            'investment_id' => $investment->id,
            'period' => 'Q3 2026',
            'version' => 1,
            'correction_of_id' => null,
        ]);

        // Referral commissions for the admin acting as referrer, one per pipeline stage.
        $commissions = [
            ['referred_investment_id' => $investment->id, 'amount_cents' => 250000, 'status' => 'accrued', 'settled_at' => null],
            ['referred_investment_id' => $investment2->id, 'amount_cents' => 300000, 'status' => 'approved', 'settled_at' => null],
            ['referred_investment_id' => $fundedInvestment->id, 'amount_cents' => 200000, 'status' => 'payable', 'settled_at' => null],
            ['referred_investment_id' => $fundedInvestment->id, 'amount_cents' => 200000, 'status' => 'paid', 'settled_at' => now()->subDays(4)],
        ];
        foreach ($commissions as $commission) {
            ReferralCommission::create([
                'referrer_id' => $admin->id,
                ...$commission,
            ]);
        }

        BlogPost::create([
            'slug' => 'spv-explained',
            'title' => 'Why every project gets its own company (SPV)',
            'excerpt' => 'Ring-fencing each asset in its own company protects investors if anything goes wrong elsewhere.',
            'body' => '<p class="lede">Every OwnStakeX project is held in its own special purpose vehicle — a dedicated company that owns nothing but that asset.</p><h2>Why it matters</h2><p>If one project underperforms, creditors of that project cannot reach the assets of another. Your stake maps to a specific company, a specific asset and a specific register entry.</p><h2>What to check</h2><ul><li>The SPV name on your certificate matches the project documents</li><li>The asset is the SPV\'s only material holding</li><li>Distributions flow from the SPV to unit holders</li></ul><p><em>Capital at risk. Educational content, not financial advice.</em></p>',
            'cover_image' => null,
            'tag' => 'Mechanics',
            'read_time' => '4 min read',
            'published_at' => now()->subDays(6),
        ]);

        BlogPost::create([
            'slug' => 'reservation-vs-ownership',
            'title' => 'Reservation vs ownership: know the difference',
            'excerpt' => 'Reserving units is an expression of interest — ownership begins when payment clears and the register updates.',
            'body' => '<p class="lede">A reservation holds your place in the queue. It is not ownership.</p><h2>The journey</h2><ol><li><strong>Reserve</strong> — units are earmarked in your name</li><li><strong>Pay</strong> — funds clear to the project account</li><li><strong>Own</strong> — the register updates and your certificate is issued</li></ol><p>Until step three, you hold a reservation, not an asset.</p><p><em>Capital at risk. Educational content, not financial advice.</em></p>',
            'cover_image' => null,
            'tag' => 'Mechanics',
            'read_time' => '3 min read',
            'published_at' => now()->subDays(3),
        ]);

        BlogPost::create([
            'slug' => 'fractional-ownership-gcc-trend',
            'title' => 'Fractional ownership is quietly growing across the GCC',
            'excerpt' => 'High-value assets are being split into affordable units — here is what is driving the trend.',
            'body' => '<p class="lede">From marina berths to office floors, the GCC is seeing more assets offered in fractions.</p><h2>What is driving it</h2><ul><li><strong>Ticket sizes</strong> — prime assets are out of reach for most buyers whole</li><li><strong>Transparency</strong> — registers and reporting make shared ownership practical</li><li><strong>Yield focus</strong> — investors want income-producing assets, not just appreciation bets</li></ul><p>None of this removes risk — it changes its shape.</p><p><em>Capital at risk. Educational content, not financial advice.</em></p>',
            'cover_image' => null,
            'tag' => 'Market',
            'read_time' => '5 min read',
            'published_at' => now()->subDay(),
        ]);

        Announcement::create([
            'title' => 'August reports published for 2 projects',
            'body' => 'Monthly reports for the Business Bay Commercial Tower and Dubai Charter Yacht are now available in the document library.',
            'audience' => 'all',
            'published_at' => now()->subDays(2),
        ]);

        Announcement::create([
            'title' => 'Yacht funding call expected 05 Nov 2026',
            'body' => 'A funding call for the Dubai Charter Yacht campaign is expected in early November. Reserved investors will be notified by email.',
            'audience' => 'investors',
            'published_at' => now()->subDay(),
        ]);
    }
}
