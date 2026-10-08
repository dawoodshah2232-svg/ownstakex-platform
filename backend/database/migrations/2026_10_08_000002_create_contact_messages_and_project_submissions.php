<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Public website forms: Contact page messages and "Submit a project"
     * applications from operators / sponsors. Both are reviewed by admins.
     */
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 191);
            $table->string('subject', 150);
            $table->text('message');
            $table->timestamp('handled_at')->nullable();
            $table->timestamps();
        });

        Schema::create('project_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 191);
            $table->string('company', 150);
            $table->string('role', 100)->nullable();
            $table->string('asset_type', 60);
            $table->decimal('funding_aed', 15, 2);
            $table->string('location', 150);
            $table->text('description');
            $table->text('files')->nullable();
            $table->string('status', 20)->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_submissions');
        Schema::dropIfExists('contact_messages');
    }
};
