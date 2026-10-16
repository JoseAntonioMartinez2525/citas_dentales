<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $hasPatientForeignKey = collect(Schema::getForeignKeys('patient_portal_accesses'))
            ->contains(fn(array $foreignKey): bool => in_array('patient_id', $foreignKey['columns'], true));

        if (!$hasPatientForeignKey) {
            Schema::table('patient_portal_accesses', function (Blueprint $table): void {
                $table->foreign('patient_id')->references('id')->on('patients')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        $hasPatientForeignKey = collect(Schema::getForeignKeys('patient_portal_accesses'))
            ->contains(fn(array $foreignKey): bool => in_array('patient_id', $foreignKey['columns'], true));

        if ($hasPatientForeignKey) {
            Schema::table('patient_portal_accesses', function (Blueprint $table): void {
                $table->dropForeign(['patient_id']);
            });
        }
    }
};
