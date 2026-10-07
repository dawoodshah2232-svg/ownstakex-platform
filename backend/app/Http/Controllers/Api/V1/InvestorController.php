<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestorController extends Controller
{
    /**
     * Dashboard summary for the authenticated investor.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        $investments = $user->investments()->with('project:id,code,name,slug,cover_image,status')->get();
        $reservations = $user->reservations()->with('project:id,code,name,slug,cover_image,status')->latest()->get();
        $payments = $user->payments()->latest()->take(10)->get();

        $documents = Document::where('audience', 'investors')
            ->where(function ($q) use ($investments) {
                $q->whereNull('project_id')
                    ->orWhereIn('project_id', $investments->pluck('project_id')->filter()->unique());
            })
            ->latest()
            ->take(20)
            ->get();

        $announcements = Announcement::whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->whereIn('audience', ['all', 'investors'])
            ->latest('published_at')
            ->take(5)
            ->get();

        return response()->json([
            'investor' => $user,
            'portfolio' => [
                'total_invested' => $investments->sum('amount'),
                'total_units' => $investments->sum('units'),
                'active_investments' => $investments->where('status', 'active')->count(),
            ],
            'investments' => $investments,
            'reservations' => $reservations,
            'recent_payments' => $payments,
            'documents' => $documents,
            'announcements' => $announcements,
        ]);
    }
}
