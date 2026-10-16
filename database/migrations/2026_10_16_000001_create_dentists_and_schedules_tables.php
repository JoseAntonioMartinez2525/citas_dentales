<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dentists', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160)->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dentist_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('weekday');
            $table->time('opens_at');
            $table->time('closes_at');
            $table->timestamps();

            $table->unique(['dentist_id', 'weekday']);
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('dentist_id')->nullable()->after('patient_id')->constrained()->nullOnDelete();
            $table->index(['dentist_id', 'starts_at', 'status']);
        });

        $dentistNames = DB::table('appointments')->distinct()->pluck('dentist_name')->all();
        $dentistNames[] = 'Equipo dental';

        foreach (array_unique($dentistNames) as $dentistName) {
            $dentistId = DB::table('dentists')->insertGetId([
                'name' => $dentistName,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('schedules')->insert(
                collect(range(1, 5))->map(fn (int $weekday): array => [
                    'dentist_id' => $dentistId,
                    'weekday' => $weekday,
                    'opens_at' => '08:00:00',
                    'closes_at' => '18:00:00',
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->all(),
            );

            DB::table('appointments')
                ->where('dentist_name', $dentistName)
                ->update(['dentist_id' => $dentistId]);
        }
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('dentist_id');
        });

        Schema::dropIfExists('schedules');
        Schema::dropIfExists('dentists');
    }
};
