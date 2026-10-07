<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('file_url');
            $table->string('file_size')->nullable();
            $table->string('mime')->nullable();
            $table->enum('audience', ['investors', 'internal'])->default('investors');
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('version', 30)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
