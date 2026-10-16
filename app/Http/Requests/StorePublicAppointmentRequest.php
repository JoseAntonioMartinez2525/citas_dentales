<?php

namespace App\Http\Requests;

use App\Models\Dentist;
use App\Models\Service;
use App\Services\AppointmentAvailability;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StorePublicAppointmentRequest extends FormRequest
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
            'service_id' => ['required', 'integer', Rule::exists('services', 'id')->where('is_active', 1)->where('requires_assessment', 0)],
            'dentist_id' => ['required', 'integer', Rule::exists('dentists', 'id')->where('is_active', 1)],
            'date' => ['required', 'date_format:Y-m-d'],
            'starts_at' => ['required', 'date_format:Y-m-d\\TH:i'],
            'name' => ['required', 'string', 'max:160'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
        ];
    }

    public function after(AppointmentAvailability $availability): array
    {
        return [
            function (Validator $validator) use ($availability): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $service = Service::query()->where('is_active', true)->find($this->integer('service_id'));
                $dentist = Dentist::query()->where('is_active', true)->find($this->integer('dentist_id'));
                $startsAt = Carbon::createFromFormat(
                    'Y-m-d\\TH:i',
                    $this->string('starts_at')->toString(),
                    config('app.timezone'),
                );

                if ($startsAt->toDateString() !== $this->string('date')->toString()) {
                    $validator->errors()->add('starts_at', 'La fecha y el horario deben coincidir.');
                } elseif (! $service || ! $dentist || ! $availability->isAvailable($service, $startsAt, $dentist)) {
                    $validator->errors()->add('starts_at', 'Ese horario ya no está disponible. Selecciona otra hora.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'service_id.required' => 'Selecciona un servicio.',
            'service_id.exists' => 'El servicio ya no está disponible o requiere una valoración previa.',
            'dentist_id.required' => 'Selecciona un odontólogo.',
            'dentist_id.exists' => 'El odontólogo seleccionado ya no está disponible.',
            'date.required' => 'Selecciona una fecha.',
            'starts_at.required' => 'Selecciona un horario disponible.',
            'name.required' => 'Escribe el nombre del paciente.',
            'phone.required' => 'Escribe un teléfono de contacto.',
            'email.email' => 'Escribe un correo válido.',
        ];
    }
}
