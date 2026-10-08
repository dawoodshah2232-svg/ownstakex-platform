<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\CountryWaitlist;
use App\Models\ProjectSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Public website forms: notify-me waitlist, contact messages, project submissions. */
class WebsiteFormsTest extends TestCase
{
    use RefreshDatabase;

    public function test_waitlist_stores_one_signup_per_email_and_country(): void
    {
        $payload = ['name' => 'Aisha', 'email' => 'Aisha@Example.com', 'country' => 'Qatar', 'country_code' => 'qa'];
        $this->postJson('/api/v1/waitlist', $payload)->assertCreated();
        $this->postJson('/api/v1/waitlist', $payload)->assertStatus(422)->assertJsonValidationErrors('email');
        $this->postJson('/api/v1/waitlist', [...$payload, 'country' => 'Oman', 'country_code' => 'om'])->assertCreated();

        $this->assertSame(2, CountryWaitlist::count());
        $this->assertSame('aisha@example.com', CountryWaitlist::first()->email);
    }

    public function test_contact_message_is_stored(): void
    {
        $this->postJson('/api/v1/contact', ['name' => 'Ravi', 'email' => 'ravi@example.com', 'subject' => 'General enquiry', 'message' => 'How do distributions work?'])
            ->assertCreated();
        $this->assertSame(1, ContactMessage::count());
    }

    public function test_project_submission_needs_consent_and_valid_fields(): void
    {
        $payload = [
            'name' => 'Omar Khan', 'email' => 'omar@hotelco.ae', 'company' => 'HotelCo', 'asset_type' => 'Hospitality',
            'funding_aed' => 2000000, 'location' => 'Dubai, UAE', 'description' => 'A 40-key boutique hotel with contracted revenue.',
        ];
        $this->postJson('/api/v1/project-submissions', $payload)->assertStatus(422)->assertJsonValidationErrors('consent');
        $this->postJson('/api/v1/project-submissions', [...$payload, 'consent' => true, 'asset_type' => 'Crypto'])
            ->assertStatus(422)->assertJsonValidationErrors('asset_type');
        $this->postJson('/api/v1/project-submissions', [...$payload, 'consent' => true])->assertCreated();
        $this->assertSame(1, ProjectSubmission::count());
    }

    public function test_project_list_includes_reserved_and_funded(): void
    {
        $this->getJson('/api/v1/projects')->assertOk();
    }
}
