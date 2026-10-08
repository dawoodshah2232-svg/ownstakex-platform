<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ReferralCommission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferralCommissionController extends Controller
{
    /**
     * GET /api/v1/admin/referral-commissions
     */
    public function index(Request $request): JsonResponse
    {
        $commissions = ReferralCommission::with([
            'referrer:id,name,email',
            'referredInvestment:id,project_id,units,amount,status',
            'referredInvestment.project:id,code,name',
        ])->latest()->paginate($request->integer('per_page', 20));

        $commissions->getCollection()->transform(function (ReferralCommission $c) {
            $investment = $c->referredInvestment;

            return [
                'id' => $c->id,
                'referrer' => [
                    'name' => $c->referrer?->name,
                    'email' => $c->referrer?->email,
                ],
                'project' => $investment?->project ? [
                    'code' => $investment->project->code,
                    'name' => $investment->project->name,
                ] : null,
                'amount_cents' => $c->amount_cents,
                'status' => $c->status,
                'settled_at' => $c->settled_at,
            ];
        });

        return response()->json($commissions);
    }

    /**
     * POST /api/v1/admin/referral-commissions/{id}/approve (accrued → approved)
     */
    public function approve(Request $request, ReferralCommission $commission): JsonResponse
    {
        return $this->transition($request, $commission, ReferralCommission::STATUS_APPROVED);
    }

    /**
     * POST /api/v1/admin/referral-commissions/{id}/mark-payable
     * (approved → payable) — only once the referred investment's funding has settled.
     */
    public function markPayable(Request $request, ReferralCommission $commission): JsonResponse
    {
        $status = $commission->referredInvestment?->status;

        if (! in_array($status, ['funded', 'settled'], true)) {
            return response()->json([
                'message' => 'Commission becomes payable only after funding settlement.',
            ], 422);
        }

        return $this->transition($request, $commission, ReferralCommission::STATUS_PAYABLE);
    }

    /**
     * POST /api/v1/admin/referral-commissions/{id}/mark-paid
     * (payable → paid) — stamps settled_at.
     */
    public function markPaid(Request $request, ReferralCommission $commission): JsonResponse
    {
        $response = $this->transition($request, $commission, ReferralCommission::STATUS_PAID);

        if ($response->status() === 200 && $commission->status === ReferralCommission::STATUS_PAID) {
            $commission->settled_at = now();
            $commission->save();
        }

        return $response;
    }

    /**
     * Enforce the accrued → approved → payable → paid pipeline strictly.
     */
    private function transition(Request $request, ReferralCommission $commission, string $to): JsonResponse
    {
        $allowed = ReferralCommission::allowedTransitions()[$commission->status] ?? [];

        if (! in_array($to, $allowed, true)) {
            return response()->json([
                'message' => "Cannot move commission from {$commission->status} to {$to}.",
            ], 422);
        }

        $from = $commission->status;
        $commission->status = $to;
        $commission->save();

        AuditLog::create([
            'actor_id' => $request->user()->id,
            'actor_role' => $request->user()->role,
            'action' => 'referral_commission.transition',
            'detail' => "Commission #{$commission->id}: {$from} → {$to}",
        ]);

        return response()->json($commission->fresh());
    }
}
