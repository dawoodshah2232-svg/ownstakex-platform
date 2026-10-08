<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferralCommission extends Model
{
    public const STATUS_ACCRUED = 'accrued';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_PAYABLE = 'payable';
    public const STATUS_PAID = 'paid';

    protected $fillable = ['referrer_id', 'referred_investment_id', 'amount_cents', 'status', 'settled_at'];

    protected $casts = ['settled_at' => 'datetime'];

    /** @return BelongsTo<User, $this> */
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    /** @return BelongsTo<Investment, $this> */
    public function referredInvestment(): BelongsTo
    {
        return $this->belongsTo(Investment::class, 'referred_investment_id');
    }

    /**
     * Allowed status transitions (admin-driven pipeline).
     */
    public static function allowedTransitions(): array
    {
        return [
            self::STATUS_ACCRUED => [self::STATUS_APPROVED],
            self::STATUS_APPROVED => [self::STATUS_PAYABLE],
            self::STATUS_PAYABLE => [self::STATUS_PAID],
            self::STATUS_PAID => [],
        ];
    }
}
