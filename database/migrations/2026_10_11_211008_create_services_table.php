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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160)->unique();
            $table->string('slug', 180)->unique();
            $table->text('description');
            $table->unsignedSmallInteger('duration_minutes');
            $table->unsignedSmallInteger('buffer_minutes')->default(15);
            $table->boolean('requires_assessment')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
