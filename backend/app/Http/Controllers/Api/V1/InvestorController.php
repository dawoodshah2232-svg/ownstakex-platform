<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Investment;
use App\Models\Statement;
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

    /**
     * GET /api/v1/my/ownership
     * Authenticated investor's holdings with project, ownership % and certificate.
     */
    public function ownership(Request $request): JsonResponse
    {
        $investments = $request->user()->investments()
            ->with(['project:id,code,name,units', 'certificates:id,investment_id,cert_no,issued_at'])
            ->latest()
            ->get()
            ->map(function (Investment $investment) {
                $project = $investment->project;
                $units = (int) $investment->units;

                return [
                    'id' => $investment->id,
                    'project' => $project ? [
                        'code' => $project->code,
                        'name' => $project->name,
                    ] : null,
                    'units' => $units,
                    'amount' => $investment->amount,
                    'ownership_pct' => $project && $project->units > 0
                        ? round($units / $project->units * 100, 2)
                        : 0.0,
                    'certificate' => $investment->certificates->first()?->only(['cert_no', 'issued_at']),
                ];
            });

        return response()->json($investments);
    }

    /**
     * GET /api/v1/my/certificates/{certificate}
     * Full share-certificate payload. 403 unless the certificate belongs to the user.
     */
    public function certificate(Request $request, Certificate $certificate): JsonResponse
    {
        $certificate->load('investment.project');

        if ($certificate->investment === null
            || (int) $certificate->investment->user_id !== (int) $request->user()->id
        ) {
            return response()->json(['message' => 'This certificate does not belong to you.'], 403);
        }

        $investment = $certificate->investment;
        $project = $investment->project;
        $units = (int) $investment->units;

        return response()->json([
            'holder_name' => $request->user()->name,
            'investor_id' => 'INV-'.str_pad((string) $request->user()->id, 6, '0', STR_PAD_LEFT),
            'project' => $project ? [
                'name' => $project->name,
                'code' => $project->code,
            ] : null,
            'units' => $units,
            'ownership_pct' => $project && $project->units > 0
                ? round($units / $project->units * 100, 2)
                : 0.0,
            'cert_no' => $certificate->cert_no,
            'acquired_at' => $investment->created_at,
            'issued_at' => $certificate->issued_at,
            'register_ref' => $project ? 'REG-'.$project->code.'-2026' : null,
            'disclaimer' => 'This certificate records beneficial ownership of units in the named project SPV as shown on the OwnStakeX register. It is not a tradable security and does not guarantee returns. Capital at risk.',
        ]);
    }

    /**
     * GET /api/v1/my/statements
     * Authenticated investor's holding statements, newest first.
     */
    public function statements(Request $request): JsonResponse
    {
        $statements = Statement::whereIn('investment_id', $request->user()->investments()->pluck('id'))
            ->with('investment.project:id,code,name')
            ->latest()
            ->get()
            ->map(function (Statement $statement) {
                return [
                    'id' => $statement->id,
                    'period' => $statement->period,
                    'version' => $statement->version,
                    'correction_of_id' => $statement->correction_of_id,
                    'created_at' => $statement->created_at,
                    'investment' => $statement->investment ? [
                        'id' => $statement->investment->id,
                        'project' => $statement->investment->project ? [
                            'code' => $statement->investment->project->code,
                            'name' => $statement->investment->project->name,
                        ] : null,
                    ] : null,
                ];
            });

        return response()->json($statements);
    }
}
