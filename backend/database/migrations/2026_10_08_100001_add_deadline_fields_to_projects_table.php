<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Advanced CRM workflow: deadline tracking fields on projects.
     * Additive only — no existing columns touched.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dateTime('closing_date')->nullable()->after('long_stop');
            $table->dateTime('closing_original_date')->nullable()->after('closing_date');
            $table->json('extension_history')->nullable()->after('closing_original_date');
            $table->integer('held_units')->default(0)->after('extension_history');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['closing_date', 'closing_original_date', 'extension_history', 'held_units']);
        });
    }
};
