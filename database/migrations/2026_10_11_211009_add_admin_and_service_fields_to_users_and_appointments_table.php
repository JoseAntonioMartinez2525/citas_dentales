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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('password');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('service_id')->nullable()->after('patient_id')->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('buffer_minutes')->default(15)->after('duration_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropColumn(['service_id', 'buffer_minutes']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
