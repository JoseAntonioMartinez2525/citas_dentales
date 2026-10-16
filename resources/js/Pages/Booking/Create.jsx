import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, ShieldCheck, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';

const steps = ['Servicio', 'Horario', 'Tus datos', 'Confirmación'];

function formatLongDate(date) {
    return new Intl.DateTimeFormat('es', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${date}T12:00:00`));
}

export default function Create({ services, dentists, selectedDentistId, selectedServiceId, date, minimumDate, slots, patientPortalUrl, flash = {} }) {
    const [step, setStep] = useState(selectedServiceId ? 2 : 1);
    const form = useForm({
        service_id: selectedServiceId ? String(selectedServiceId) : '',
        dentist_id: selectedDentistId ? String(selectedDentistId) : '',
        date,
        starts_at: '',
        name: '',
        phone: '',
        email: '',
    });
    const selectedService = services.find((service) => String(service.id) === String(form.data.service_id));
    const selectedDentist = dentists.find((dentist) => String(dentist.id) === String(form.data.dentist_id));
    const assessmentService = services.find((service) => service.slug === 'valoracion-general');
    const selectedSlot = slots.find((slot) => slot.value === form.data.starts_at);

    function chooseService(service) {
        form.setData('service_id', String(service.id));
        form.clearErrors();
        setStep(2);
        router.get('/', { service_id: service.id, dentist_id: form.data.dentist_id, date: form.data.date }, { preserveState: true, preserveScroll: true });
    }

    function chooseDate(nextDate) {
        form.setData((current) => ({ ...current, date: nextDate, starts_at: '' }));
        form.clearErrors('starts_at');
        router.get('/', { service_id: form.data.service_id, dentist_id: form.data.dentist_id, date: nextDate }, { preserveState: true, preserveScroll: true });
    }

    function chooseDentist(dentistId) {
        form.setData((current) => ({ ...current, dentist_id: dentistId, starts_at: '' }));
        form.clearErrors('starts_at');
        router.get('/', { service_id: form.data.service_id, dentist_id: dentistId, date: form.data.date }, { preserveState: true, preserveScroll: true });
    }

    function chooseSlot(slot) {
        form.setData('starts_at', slot.value);
        form.clearErrors('starts_at');
        setStep(3);
    }

    function submitBooking(event) {
        event.preventDefault();
        form.post('/reservar', {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.starts_at) {
                    setStep(2);
                }
            },
        });
    }

    return (
        <>
            <Head title="Agendar cita" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <header className="border-b border-[#e2e6e0] bg-[#fbfcfd] dark:border-[#344550] dark:bg-[#1a242c]">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-7">
                        <Link href="/" className="flex items-center gap-3" aria-label="Clínica del Toro, inicio">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                            <span><span className="block text-sm font-bold">Clínica del Toro</span><span className="block text-xs text-[#748078] dark:text-[#9aaab4]">Reserva de citas</span></span>
                        </Link>
                        <div className="flex items-center gap-2">
                            {patientPortalUrl && <Link href={patientPortalUrl} className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-[#416984] hover:bg-[#eef2f6] dark:text-[#a9c9df] dark:hover:bg-[#25333c]">Mis citas</Link>}
                            <Link href="/login" className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-[#536159] hover:bg-[#eef2f6] dark:text-[#c0cbd3] dark:hover:bg-[#25333c] sm:inline-flex">Acceso del personal</Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-7 sm:py-12">
                    <section className="mb-8">
                        <p className="mb-2 text-sm font-medium text-[#5f7890] dark:text-[#a9c9df]">Agenda en línea</p>
                        <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Agenda tu cita</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6d7971] dark:text-[#a0afb9]">Elige el servicio y un horario disponible. Revisaremos tus datos antes de enviar la solicitud.</p>
                    </section>

                    {flash.success && <p role="status" className="mb-5 rounded-lg border border-[#c8d7e2] bg-[#e8eef4] px-4 py-3 text-sm text-[#365c78] dark:border-[#40576a] dark:bg-[#293a47] dark:text-[#c3daea]">{flash.success}</p>}
                    {flash.error && <p role="alert" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">{flash.error}</p>}

                    <nav aria-label="Pasos de reserva" className="mb-7 grid grid-cols-4 gap-2">
                        {steps.map((label, index) => {
                            const number = index + 1;
                            const active = step === number;
                            const complete = step > number;

                            return (
                                <div key={label} aria-current={active ? 'step' : undefined} aria-label={`Paso ${number} de ${steps.length}: ${label}`} className={`border-t-2 pt-2 ${active || complete ? 'border-[#416984] dark:border-[#83a9c4]' : 'border-[#dfe4de] dark:border-[#344550]'}`}>
                                    <span className={`text-[11px] font-medium sm:text-xs ${active || complete ? 'text-[#416984] dark:text-[#a9c9df]' : 'text-[#87918b] dark:text-[#788a96]'}`}>0{number} <span className="sr-only sm:not-sr-only">/ {label}</span></span>
                                </div>
                            );
                        })}
                    </nav>

                    <section className="rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730] sm:p-7">
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold">1. Selecciona un servicio</h2>
                                <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">Las duraciones son datos ficticios de prototipo.</p>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {services.map((service) => (
                                        <div key={service.id} className="grid gap-2">
                                            <button type="button" disabled={service.requires_assessment} onClick={() => chooseService(service)} className="rounded-lg border border-[#dfe4de] p-4 text-left transition hover:border-[#7d9bb2] hover:bg-[#f7f9fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#416984] disabled:cursor-not-allowed disabled:opacity-75 dark:border-[#3a4a55] dark:hover:border-[#6487a1] dark:hover:bg-[#202d36] dark:focus-visible:outline-[#83a9c4]">
                                                <span className="flex items-start justify-between gap-3">
                                                    <span className="font-semibold">{service.name}</span>
                                                    <span className="shrink-0 text-xs text-[#627d94] dark:text-[#a9c9df]">{service.duration_minutes} min</span>
                                                </span>
                                                <span className="mt-2 block text-sm leading-5 text-[#728078] dark:text-[#a0afb9]">{service.description}</span>
                                                {service.requires_assessment && <span className="mt-3 block text-xs font-medium text-amber-700 dark:text-amber-300">Requiere valoración previa</span>}
                                            </button>
                                            {service.requires_assessment && assessmentService && (
                                                <Link href={`/?service_id=${assessmentService.id}`} className="px-1 text-xs font-semibold text-[#416984] hover:underline dark:text-[#a9c9df]">Reservar valoración primero</Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {services.length === 0 && <p className="mt-5 text-sm text-[#728078] dark:text-[#a0afb9]">No hay servicios disponibles para reservar.</p>}
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <button type="button" onClick={() => setStep(1)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#416984] dark:text-[#a9c9df]"><ArrowLeft size={16} /> Cambiar servicio</button>
                                <h2 className="text-xl font-semibold">2. Elige fecha y horario</h2>
                                {selectedService && <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">{selectedService.name} · {selectedService.duration_minutes} min y {selectedService.buffer_minutes} min de preparación</p>}
                                <label className="mt-5 grid max-w-md gap-1.5 text-sm font-medium">Odontólogo
                                    <select value={form.data.dentist_id} onChange={(event) => chooseDentist(event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] bg-white px-3 text-base dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required>
                                        <option value="">Seleccionar odontólogo</option>
                                        {dentists.map((dentist) => <option key={dentist.id} value={dentist.id}>{dentist.name}</option>)}
                                    </select>
                                </label>
                                <label className="mt-5 grid max-w-xs gap-1.5 text-sm font-medium">Fecha
                                    <span className="relative">
                                        <CalendarDays size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87918b] dark:text-[#94a4af]" />
                                        <input type="date" min={minimumDate} value={form.data.date} onChange={(event) => chooseDate(event.target.value)} aria-label="Fecha de la cita" className="h-11 w-full rounded-lg border border-[#dfe4de] bg-white pl-10 pr-3 text-base dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" />
                                    </span>
                                </label>
                                <p className="mt-5 text-sm font-medium">Horarios disponibles{selectedDentist ? ` · ${selectedDentist.name}` : ''}</p>
                                {slots.length > 0 ? (
                                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                                        {slots.map((slot) => (
                                            <button key={slot.value} type="button" onClick={() => chooseSlot(slot)} aria-pressed={form.data.starts_at === slot.value} className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#416984] ${form.data.starts_at === slot.value ? 'border-[#416984] bg-[#e8eef4] text-[#355d79] dark:border-[#7193ac] dark:bg-[#293a47] dark:text-[#c3daea]' : 'border-[#dfe4de] hover:border-[#7d9bb2] hover:bg-[#f7f9fb] dark:border-[#3a4a55] dark:hover:border-[#6487a1] dark:hover:bg-[#202d36]'}`}>
                                                <Clock3 size={14} /> {slot.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-3 rounded-lg bg-[#f3f5f7] px-4 py-3 text-sm text-[#65716a] dark:bg-[#141d24] dark:text-[#a0afb9]">No hay horarios para esta fecha. Prueba otro día de atención.</p>
                                )}
                                {form.errors.starts_at && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{form.errors.starts_at}</p>}
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <button type="button" onClick={() => setStep(2)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#416984] dark:text-[#a9c9df]"><ArrowLeft size={16} /> Cambiar horario</button>
                                <h2 className="text-xl font-semibold">3. Tus datos de contacto</h2>
                                <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">No incluyas información clínica. Usa datos ficticios para esta demostración.</p>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <label className="grid gap-1.5 text-sm font-medium">Nombre completo
                                        <input autoComplete="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} aria-invalid={Boolean(form.errors.name)} aria-describedby={form.errors.name ? 'booking-name-error' : undefined} className="h-11 rounded-lg border border-[#dfe4de] px-3 text-base font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                                        {form.errors.name && <span id="booking-name-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.name}</span>}
                                    </label>
                                    <label className="grid gap-1.5 text-sm font-medium">Teléfono
                                        <input autoComplete="tel" type="tel" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} aria-invalid={Boolean(form.errors.phone)} aria-describedby={form.errors.phone ? 'booking-phone-error' : undefined} className="h-11 rounded-lg border border-[#dfe4de] px-3 text-base font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                                        {form.errors.phone && <span id="booking-phone-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.phone}</span>}
                                    </label>
                                    <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">Correo electrónico <span className="font-normal text-[#89938d] dark:text-[#94a4af]">(opcional)</span>
                                        <input autoComplete="email" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} aria-invalid={Boolean(form.errors.email)} aria-describedby={form.errors.email ? 'booking-email-error' : undefined} className="h-11 rounded-lg border border-[#dfe4de] px-3 text-base font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" />
                                        {form.errors.email && <span id="booking-email-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.email}</span>}
                                    </label>
                                </div>
                                <button type="button" onClick={() => setStep(4)} disabled={!form.data.name.trim() || !form.data.phone.trim()} className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white hover:bg-[#31556f] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#527e9d] dark:hover:bg-[#628ca9]">Revisar cita <ArrowRight size={16} /></button>
                            </div>
                        )}

                        {step === 4 && (
                            <form onSubmit={submitBooking}>
                                <button type="button" onClick={() => setStep(3)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#416984] dark:text-[#a9c9df]"><ArrowLeft size={16} /> Volver a mis datos</button>
                                <h2 className="text-xl font-semibold">4. Confirma los datos</h2>
                                <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">Verifica el resumen antes de enviar la solicitud.</p>
                                <dl className="mt-5 divide-y divide-[#e9ece8] rounded-lg border border-[#e2e6e0] px-4 dark:divide-[#344550] dark:border-[#344550]">
                                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Servicio</dt><dd className="font-medium">{selectedService?.name}</dd></div>
                                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Odontólogo</dt><dd className="font-medium">{selectedDentist?.name}</dd></div>
                                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Fecha</dt><dd className="font-medium capitalize">{formatLongDate(form.data.date)}</dd></div>
                                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Horario</dt><dd className="font-medium">{selectedSlot?.label}</dd></div>
                                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Paciente</dt><dd className="font-medium">{form.data.name}</dd></div>
                                    <div className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Contacto</dt><dd className="font-medium">{form.data.phone}</dd></div>
                                </dl>
                                {form.errors.starts_at && <p role="alert" className="mt-4 text-sm text-rose-700 dark:text-rose-300">{form.errors.starts_at}</p>}
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="inline-flex items-center gap-2 text-xs text-[#728078] dark:text-[#a0afb9]"><ShieldCheck size={15} /> Solo se solicitan datos de contacto para el prototipo.</p>
                                    <button type="submit" disabled={form.processing} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white hover:bg-[#31556f] disabled:opacity-60 dark:bg-[#527e9d] dark:hover:bg-[#628ca9]"><Check size={16} /> {form.processing ? 'Enviando…' : 'Confirmar cita'}</button>
                                </div>
                            </form>
                        )}
                    </section>
                    <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-[#87918b] dark:text-[#899ba7]">Horarios y servicios de demostración: confirma las reglas reales con el consultorio antes de usarlos fuera del prototipo.</p>
                    <nav aria-label="Evaluaciones de experiencia" className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
                        <Link href="/evaluacion/card-sorting" className="text-[#416984] underline-offset-4 hover:underline dark:text-[#a9c9df]">Participar en Card Sorting</Link>
                        <Link href="/evaluacion/sus" className="text-[#416984] underline-offset-4 hover:underline dark:text-[#a9c9df]">Responder escala de usabilidad</Link>
                    </nav>
                </main>
            </div>
        </>
    );
}