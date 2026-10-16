<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_sorting_responses', function (Blueprint $table) {
            $table->id();
            $table->json('groups');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('sus_responses', function (Blueprint $table) {
            $table->id();
            $table->json('answers');
            $table->decimal('score', 5, 2);
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->index('submitted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sus_responses');
        Schema::dropIfExists('card_sorting_responses');
    }
};
