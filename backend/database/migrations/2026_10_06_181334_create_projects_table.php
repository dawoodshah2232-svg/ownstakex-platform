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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('location');
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->decimal('capital', 15, 2);
            $table->integer('units');
            $table->decimal('unit_price', 15, 2);
            $table->integer('min_units')->default(1);
            $table->integer('max_units')->default(20);
            $table->integer('reserved')->default(0);
            $table->integer('funded')->default(0);
            $table->enum('status', ['draft', 'evaluation', 'funding', 'closing', 'operating'])->default('draft');
            $table->string('version', 20)->default('v1.0');
            $table->date('campaign_ends')->nullable();
            $table->date('long_stop')->nullable();
            $table->string('operator')->nullable();
            $table->string('issuer')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('video_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
