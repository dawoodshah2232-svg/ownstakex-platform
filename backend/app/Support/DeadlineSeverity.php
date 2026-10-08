<?php

namespace App\Support;

use Carbon\Carbon;
use Carbon\CarbonInterface;

/**
 * Deadline severity bands — server-side mirror of the static demo's
 * `window.dlSev(days)` (bridging-investments/js/data.js).
 *
 * Bands (days_left, fractional, negative when past):
 *   < 0   expired
 *   < 1   final
 *   < 3   critical
 *   < 7   urgent
 *   < 15  attention
 *   <= 30 active
 *   else  normal
 */
class DeadlineSeverity
{
    /**
     * @return array{key: string, label: string, days_left: float|null}
     */
    public static function band(?CarbonInterface $closingDate, ?CarbonInterface $now = null): array
    {
        if ($closingDate === null) {
            return ['key' => 'none', 'label' => 'No deadline', 'days_left' => null];
        }

        $now = $now ?? Carbon::now();
        $daysLeft = self::floatDaysLeft($now, $closingDate);

        if ($daysLeft < 0) {
            $band = ['key' => 'expired', 'label' => 'Expired'];
        } elseif ($daysLeft < 1) {
            $band = ['key' => 'final', 'label' => 'Final day'];
        } elseif ($daysLeft < 3) {
            $band = ['key' => 'critical', 'label' => 'Critical'];
        } elseif ($daysLeft < 7) {
            $band = ['key' => 'urgent', 'label' => 'Urgent'];
        } elseif ($daysLeft < 15) {
            $band = ['key' => 'attention', 'label' => 'Attention'];
        } elseif ($daysLeft <= 30) {
            $band = ['key' => 'active', 'label' => 'Active'];
        } else {
            $band = ['key' => 'normal', 'label' => 'Normal'];
        }

        return $band + ['days_left' => round($daysLeft, 2)];
    }

    /**
     * Fractional signed days from $now to $closingDate.
     */
    public static function floatDaysLeft(CarbonInterface $now, CarbonInterface $closingDate): float
    {
        return $now->diffInSeconds($closingDate, false) / 86400;
    }
}
