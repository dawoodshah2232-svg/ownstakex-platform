<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Advanced CRM workflow: reservation payment breakdown fields.
     * Additive only — existing columns untouched.
     */
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->integer('reservation_fee_cents')->nullable()->after('status');
            $table->integer('balance_due_cents')->nullable()->after('reservation_fee_cents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['reservation_fee_cents', 'balance_due_cents']);
        });
    }
};
