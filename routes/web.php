<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientPortalController;
use App\Http\Controllers\PublicBookingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicBookingController::class, 'create'])->name('booking.start');
Route::post('/reservar', [PublicBookingController::class, 'store'])->name('booking.store');
Route::get('/reserva/confirmacion', [PublicBookingController::class, 'success'])->name('booking.success');
Route::get('/mis-citas', [PatientPortalController::class, 'index'])->name('patient.appointments');
Route::get('/mis-citas/{accessToken}', [PatientPortalController::class, 'index'])->name('patient.appointments.access');
Route::post('/mis-citas/{appointment}/cancelar', [PatientPortalController::class, 'cancel'])
    ->name('patient.appointments.cancel');
Route::post('/mis-citas/salir', [PatientPortalController::class, 'leave'])->name('patient.portal.leave');

Route::get('/login', [AuthController::class, 'create'])->name('login');
Route::post('/login', [AuthController::class, 'store'])->name('login.store');

Route::middleware(['auth', 'administrator'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
    Route::get('/', [AppointmentController::class, 'index'])->name('dashboard');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus'])
        ->name('appointments.status');

    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
});
