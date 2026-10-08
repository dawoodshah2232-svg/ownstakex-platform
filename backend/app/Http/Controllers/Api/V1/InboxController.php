<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\ProjectSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public website forms (Contact page, Submit a project) and the admin
 * lists to review them.
 */
class InboxController extends Controller
{
    public const ASSET_TYPES = ['Commercial property', 'Hospitality', 'Maritime / charter', 'Logistics', 'Other income asset'];

    /** POST /contact { name, email, subject, message } — public. */
    public function contact(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:191',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|min:10|max:5000',
        ]);

        ContactMessage::create([...$data, 'email' => strtolower(trim($data['email']))]);

        return response()->json(['message' => 'Message sent. We reply within 2 business days.'], 201);
    }

    /** POST /project-submissions — public "Submit a project" form. */
    public function submitProject(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:191',
            'company' => 'required|string|min:2|max:150',
            'role' => 'nullable|string|max:100',
            'asset_type' => 'required|string|in:' . implode(',', self::ASSET_TYPES),
            'funding_aed' => 'required|numeric|min:1|max:10000000000',
            'location' => 'required|string|min:2|max:150',
            'description' => 'required|string|min:20|max:5000',
            'files' => 'nullable|string|max:1000',
            'consent' => 'accepted',
        ], [
            'consent.accepted' => 'Please tick the consent checkbox to submit.',
            'description.min' => 'Please describe the project in a little more detail (at least 20 characters).',
        ]);

        unset($data['consent']);
        ProjectSubmission::create([...$data, 'email' => strtolower(trim($data['email']))]);

        return response()->json(['message' => 'Submission received. Our project team will review it within 10 business days.'], 201);
    }

    /** GET /admin/contact-messages */
    public function contactMessages(): JsonResponse
    {
        return response()->json(['data' => ContactMessage::latest()->limit(500)->get()]);
    }

    /** GET /admin/project-submissions */
    public function projectSubmissions(): JsonResponse
    {
        return response()->json(['data' => ProjectSubmission::latest()->limit(500)->get()]);
    }
}
