<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CountryWaitlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Projects page "notify me": visitors from a country with no open project
 * leave their email; admins see the list per country.
 */
class WaitlistController extends Controller
{
    /** POST /waitlist { name, email, country, country_code? } — public. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:191',
            'country' => 'required|string|min:2|max:100',
            'country_code' => 'nullable|string|size:2|alpha',
        ]);

        $email = strtolower(trim($data['email']));
        $country = trim($data['country']);

        $exists = CountryWaitlist::where('email', $email)->where('country', $country)->exists();
        if ($exists) {
            return response()->json([
                'message' => "This email is already on the list for {$country}.",
                'errors' => ['email' => ["This email is already on the list for {$country}."]],
            ], 422);
        }

        CountryWaitlist::create([
            'name' => trim($data['name']),
            'email' => $email,
            'country' => $country,
            'country_code' => isset($data['country_code']) ? strtolower($data['country_code']) : null,
        ]);

        return response()->json(['message' => "You're on the list — we'll email you when we launch in {$country}."], 201);
    }

    /** GET /admin/waitlist — admins: sign-ups, newest first, with per-country counts. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => CountryWaitlist::latest()->limit(500)->get(),
            'by_country' => CountryWaitlist::selectRaw('country, count(*) as total')->groupBy('country')->orderByDesc('total')->get(),
        ]);
    }
}
