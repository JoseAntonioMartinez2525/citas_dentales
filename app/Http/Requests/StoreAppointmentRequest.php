<?php

namespace App\Http\Requests;

use App\Models\Appointment;
use App\Models\Dentist;
use App\Services\AppointmentAvailability;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'dentist_id' => ['required', 'integer', 'exists:dentists,id'],
            'service_name' => ['required', 'string', 'max:160'],
            'starts_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'in:15,30,45,60,90,120'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function after(AppointmentAvailability $availability): array
    {
        return [
            function (Validator $validator) use ($availability): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $dentist = Dentist::query()->where('is_active', true)->find($this->integer('dentist_id'));
                $startsAt = Carbon::parse($this->string('starts_at')->toString());

                if (! $dentist) {
                    $validator->errors()->add('dentist_id', 'El odontólogo seleccionado no está disponible.');
                } elseif (! $availability->isAvailableForDuration($dentist, $startsAt, $this->integer('duration_minutes'))) {
                    $validator->errors()->add('starts_at', 'Ese odontólogo ya tiene una cita en ese horario.');
                }
            }
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'Selecciona un paciente.',
            'patient_id.exists' => 'El paciente seleccionado ya no existe.',
            'dentist_id.required' => 'Selecciona un odontólogo.',
            'dentist_id.exists' => 'El odontólogo seleccionado ya no existe.',
            'service_name.required' => 'Escribe el tratamiento de la cita.',
            'starts_at.required' => 'Selecciona la fecha y hora de la cita.',
            'starts_at.after' => 'La cita debe programarse para una fecha futura.',
            'duration_minutes.in' => 'Elige una duración disponible.',
        ];
    }
}
