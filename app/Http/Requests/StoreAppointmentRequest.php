<?php

namespace App\Http\Requests;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Illuminate\Database\Eloquent\Builder;

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
            'dentist_name' => ['required', 'string', 'max:160'],
            'service_name' => ['required', 'string', 'max:160'],
            'starts_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'in:15,30,45,60,90,120'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $startsAt = Carbon::parse($this->string('starts_at')->toString());
                $endsAt = $startsAt->copy()->addMinutes($this->integer('duration_minutes'));

                $hasConflict = Appointment::query()
                    ->where('dentist_name', $this->string('dentist_name')->trim()->toString())
                    ->whereIn('status', ['scheduled', 'confirmed'])
                    ->where('starts_at', '<', $endsAt)
                    ->where('ends_at', '>', $startsAt)
                    ->exists();

                if ($hasConflict) {
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
            'dentist_name.required' => 'Escribe el nombre del odontólogo.',
            'service_name.required' => 'Escribe el tratamiento de la cita.',
            'starts_at.required' => 'Selecciona la fecha y hora de la cita.',
            'starts_at.after' => 'La cita debe programarse para una fecha futura.',
            'duration_minutes.in' => 'Elige una duración disponible.',
        ];
    }
}
