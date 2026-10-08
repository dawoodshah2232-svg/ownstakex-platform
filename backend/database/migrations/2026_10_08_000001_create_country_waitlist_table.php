<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * "Notify me" sign-ups from the Projects page for countries where no
     * project is open yet — one row per email per country.
     */
    public function up(): void
    {
        Schema::create('country_waitlist', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 191);
            $table->string('country', 100);
            $table->string('country_code', 2)->nullable();
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();
            $table->unique(['email', 'country']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('country_waitlist');
    }
};
