<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Advanced CRM workflow tables: certificates, statements, polls,
     * poll votes and referral commissions.
     */
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investment_id')->constrained()->cascadeOnDelete();
            $table->string('cert_no')->unique();
            $table->dateTime('issued_at');
            $table->timestamps();
        });

        Schema::create('statements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investment_id')->constrained()->cascadeOnDelete();
            $table->string('period', 100);
            $table->integer('version')->default(1);
            $table->foreignId('correction_of_id')->nullable()->constrained('statements')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('polls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('question');
            $table->json('options');
            $table->dateTime('closes_at')->nullable();
            $table->timestamps();
        });

        Schema::create('poll_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poll_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('option_index');
            $table->unique(['poll_id', 'user_id']);
            $table->timestamps();
        });

        Schema::create('referral_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('referred_investment_id')->constrained('investments')->cascadeOnDelete();
            $table->integer('amount_cents');
            $table->enum('status', ['accrued', 'approved', 'payable', 'paid'])->default('accrued');
            $table->dateTime('settled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referral_commissions');
        Schema::dropIfExists('poll_votes');
        Schema::dropIfExists('polls');
        Schema::dropIfExists('statements');
        Schema::dropIfExists('certificates');
    }
};
