<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientPortalController;
use App\Http\Controllers\PublicBookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\CardSortingController;
use App\Http\Controllers\EvaluationResultsController;
use App\Http\Controllers\SusEvaluationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicBookingController::class, 'create'])->name('booking.start');
Route::post('/reservar', [PublicBookingController::class, 'store'])->name('booking.store');
Route::get('/reserva/confirmacion', [PublicBookingController::class, 'success'])->name('booking.success');
Route::get('/evaluacion/card-sorting', [CardSortingController::class, 'create'])->name('evaluations.card-sorting.create');
Route::post('/evaluacion/card-sorting', [CardSortingController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('evaluations.card-sorting.store');
Route::get('/evaluacion/sus', [SusEvaluationController::class, 'create'])->name('evaluations.sus.create');
Route::post('/evaluacion/sus', [SusEvaluationController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('evaluations.sus.store');
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

    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

    Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/dentists', [ScheduleController::class, 'storeDentist'])->name('dentists.store');
    Route::put('/dentists/{dentist}', [ScheduleController::class, 'updateDentist'])->name('dentists.update');
    Route::put('/dentists/{dentist}/schedules', [ScheduleController::class, 'updateSchedules'])
        ->name('dentists.schedules.update');
    Route::get('/evaluaciones', [EvaluationResultsController::class, 'index'])->name('evaluations.index');
});
