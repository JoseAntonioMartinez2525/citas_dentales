import { Head, Link, router, useForm } from '@inertiajs/react';
import DentalMark from '../Components/DentalMark';
import ThemeToggle from '../Components/ThemeToggle';
import {
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Plus,
    Search,
    UserRound,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const statusLabels = {
    scheduled: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    no_show: 'No asistió',
};

const statusStyles = {
    scheduled: 'bg-amber-50 text-amber-800 ring-amber-200',
    confirmed: 'bg-[#e8eef4] text-[#365c78] ring-[#c8d7e2] dark:bg-[#293a47] dark:text-[#c3daea] dark:ring-[#40576a]',
    completed: 'bg-slate-100 text-slate-700 ring-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
    no_show: 'bg-orange-50 text-orange-800 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-200 dark:ring-orange-900',
};

function formatDate(date) {
    return new Intl.DateTimeFormat('es', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${date}T12:00:00`));
}

function shiftDate(date, amount) {
    const shiftedDate = new Date(`${date}T12:00:00`);
    shiftedDate.setDate(shiftedDate.getDate() + amount);
    return [shiftedDate.getFullYear(), String(shiftedDate.getMonth() + 1).padStart(2, '0'), String(shiftedDate.getDate()).padStart(2, '0')].join('-');
}

export default function Dashboard({ date, appointments, patients, dentists, stats, flash = {} }) {
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const form = useForm({
        patient_id: '',
        dentist_id: dentists[0] ? String(dentists[0].id) : '',
        service_name: '',
        starts_at: `${date}T09:00`,
        duration_minutes: '30',
        notes: '',
    });

    const visibleAppointments = useMemo(() => {
        const query = search.trim().toLocaleLowerCase('es');

        if (!query) {
            return appointments;
        }

        return appointments.filter((appointment) => [
            appointment.patient.name,
            appointment.patient.phone,
            appointment.dentist_name,
            appointment.service_name,
        ].some((value) => value?.toLocaleLowerCase('es').includes(query)));
    }, [appointments, search]);

    function navigateToDate(nextDate) {
        router.get('/', { date: nextDate }, { preserveState: true, preserveScroll: true });
    }

    function submitAppointment(event) {
        event.preventDefault();
        form.post('/admin/appointments', {
            preserveScroll: true,
            onSuccess: () => {
                setIsFormOpen(false);
                form.reset();
            },
        });
    }

    function updateStatus(appointment, status) {
        router.patch(`/admin/appointments/${appointment.id}/status`, { status }, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Agenda" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#e1e5df] bg-[#fbfcfd] px-5 py-6 dark:border-[#344550] dark:bg-[#1a242c] lg:flex lg:flex-col">
                    <Link href="/admin" className="flex items-center gap-3" aria-label="Clínica del Toro, panel administrativo">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]">
                            <DentalMark className="size-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-bold">Clínica del Toro</span>
                            <span className="block text-xs text-[#748078]">Gestión dental</span>
                        </span>
                    </Link>

                    <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87918b] dark:text-[#94a4af]">Espacio de trabajo</p>
                    <nav className="grid gap-1" aria-label="Navegación principal">
                        <Link href="/admin" className="flex items-center gap-3 rounded-lg bg-[#e8eef4] px-3 py-2.5 text-sm font-semibold text-[#416984] dark:bg-[#293a47] dark:text-[#c3daea]">
                            <CalendarDays size={18} /> Agenda
                        </Link>
                        <Link href="/admin/patients" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]">
                            <UserRound size={18} /> Pacientes
                        </Link>
                        <Link href="/admin/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><Clock3 size={18} /> Servicios</Link>
                        <Link href="/admin/schedules" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><Clock3 size={18} /> Horarios y odontólogos</Link>
                        <Link href="/admin/evaluaciones" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><Check size={18} /> Evaluaciones</Link>
                    </nav>

                    <div className="mt-auto border-t border-[#e7eae5] pt-5 dark:border-[#344550]">
                        <div className="flex items-center gap-3 px-2">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#dce7ef] text-sm font-semibold text-[#365c78] dark:bg-[#293a47] dark:text-[#c3daea]">CT</span>
                            <span>
                                <span className="block text-sm font-semibold">Clínica del Toro</span>
                                <span className="block text-xs text-[#7e8982] dark:text-[#9aaab4]">Administración</span>
                            </span>
                        </div>
                    </div>
                </aside>

                <main className="mx-auto max-w-7xl px-4 py-5 sm:px-7 sm:py-8 lg:ml-64 lg:px-10">
                    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e6e0] pb-5 dark:border-[#344550]">
                        <div className="flex items-center gap-2 lg:hidden">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-[18px]" /></span>
                            <span className="text-sm font-bold">Clínica del Toro</span>
                        </div>
                        <nav className="flex flex-wrap items-center gap-3 text-sm lg:hidden" aria-label="Navegación principal">
                            <Link href="/admin" className="font-semibold text-[#416984] dark:text-[#a9c9df]">Agenda</Link>
                            <Link href="/admin/patients" className="text-[#65716a] dark:text-[#a9b6bf]">Pacientes</Link>
                            <Link href="/admin/services" className="text-[#65716a] dark:text-[#a9b6bf]">Servicios</Link>
                            <Link href="/admin/schedules" className="text-[#65716a] dark:text-[#a9b6bf]">Horarios</Link>
                            <Link href="/admin/evaluaciones" className="text-[#65716a] dark:text-[#a9b6bf]">Evaluaciones</Link>
                        </nav>
                        <div className="hidden text-sm text-[#7a857e] dark:text-[#9aaab4] lg:block">Agenda por odontólogo</div>
                        <ThemeToggle />
                        <Link href="/admin/logout" method="post" as="button" className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium text-[#536159] dark:border-[#3a4a55] dark:text-[#c0cbd3]">Cerrar sesión</Link>
                        <button
                            type="button"
                            onClick={() => {
                                form.setData('starts_at', `${date}T09:00`);
                                setIsFormOpen(true);
                            }}
                            disabled={patients.length === 0 || dentists.length === 0}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white transition hover:bg-[#31556f] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#527e9d] dark:hover:bg-[#628ca9]"
                            title={patients.length === 0 ? 'Agrega un paciente antes de reservar' : 'Crear una cita'}
                        >
                            <Plus size={17} /> Nueva cita
                        </button>
                    </header>

                    <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-sm font-medium capitalize text-[#6d7971] dark:text-[#a0afb9]">Agenda clínica</p>
                            <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Citas</h1>
                            <p className="mt-2 text-sm capitalize text-[#6d7971] dark:text-[#a0afb9]">{formatDate(date)}</p>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-auto">
                            <button type="button" onClick={() => navigateToDate(shiftDate(date, -1))} aria-label="Día anterior" className="flex size-10 items-center justify-center rounded-lg border border-[#dfe4de] bg-white text-[#536159] hover:bg-[#f7f9f6] dark:border-[#3a4a55] dark:bg-[#1c2730] dark:text-[#c0cbd3] dark:hover:bg-[#263640]"><ChevronLeft size={18} /></button>
                            <input type="date" value={date} onChange={(event) => navigateToDate(event.target.value)} aria-label="Seleccionar día" className="h-10 rounded-lg border border-[#dfe4de] bg-white px-3 text-sm text-[#39473f] dark:border-[#3a4a55] dark:bg-[#1c2730] dark:text-[#e5edf2]" />
                            <button type="button" onClick={() => navigateToDate(shiftDate(date, 1))} aria-label="Día siguiente" className="flex size-10 items-center justify-center rounded-lg border border-[#dfe4de] bg-white text-[#536159] hover:bg-[#f7f9f6] dark:border-[#3a4a55] dark:bg-[#1c2730] dark:text-[#c0cbd3] dark:hover:bg-[#263640]"><ChevronRight size={18} /></button>
                        </div>
                    </section>

                    {flash.success && <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{flash.success}</div>}

                    <section className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-5" aria-label="Resumen de citas">
                        {[
                            ['Citas del día', stats.total, 'Todas las reservas'],
                            ['Pendientes', stats.scheduled, 'Por confirmar'],
                            ['Confirmadas', stats.confirmed, 'Listas para atender'],
                            ['Completadas', stats.completed, 'Atenciones finalizadas'],
                            ['No asistió', stats.no_show, 'Citas sin presentación'],
                        ].map(([label, value, detail]) => (
                            <div key={label} className="rounded-xl border border-[#e2e6e0] bg-white px-4 py-4 dark:border-[#344550] dark:bg-[#1c2730] sm:px-5">
                                <p className="text-sm text-[#728078] dark:text-[#a0afb9]">{label}</p>
                                <div className="mt-2 flex items-end justify-between gap-2">
                                    <p className="text-3xl font-semibold tabular-nums">{value}</p>
                                    <span className="hidden text-right text-xs text-[#87918b] dark:text-[#94a4af] sm:block">{detail}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="overflow-hidden rounded-xl border border-[#e2e6e0] bg-white dark:border-[#344550] dark:bg-[#1c2730]">
                        <div className="flex flex-col gap-4 border-b border-[#e9ece8] px-4 py-4 dark:border-[#344550] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="text-base font-semibold">Agenda del día</h2>
                                <p className="mt-1 text-sm text-[#7a857e] dark:text-[#9aaab4]">{visibleAppointments.length} {visibleAppointments.length === 1 ? 'cita programada' : 'citas programadas'}</p>
                            </div>
                            <label className="relative block w-full sm:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87918b] dark:text-[#94a4af]" />
                                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en la agenda" className="h-10 w-full rounded-lg border border-[#dfe4de] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#6f86a0] focus:ring-2 focus:ring-[#dce6ef] dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2] dark:placeholder:text-[#788a96] dark:focus:border-[#6e94af] dark:focus:ring-[#304757]" />
                            </label>
                        </div>

                        {visibleAppointments.length > 0 ? (
                            <div className="divide-y divide-[#edf0ec] dark:divide-[#344550]">
                                {visibleAppointments.map((appointment) => (
                                    <article key={appointment.id} className="grid gap-4 px-4 py-5 sm:grid-cols-[90px_minmax(0,1fr)_auto] sm:items-center sm:px-6">
                                        <div className="flex items-center gap-2 text-sm font-semibold tabular-nums text-[#46534b] dark:text-[#d6e0e6] sm:block">
                                            <Clock3 size={15} className="text-[#819087] dark:text-[#9aaab4] sm:hidden" />
                                            <span>{appointment.starts_at}</span><span className="text-[#9aa39d] dark:text-[#788a96]">– {appointment.ends_at}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="truncate font-semibold">{appointment.patient.name}</h3>
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[appointment.status] ?? statusStyles.scheduled}`}>{statusLabels[appointment.status] ?? appointment.status}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-[#6f7a73] dark:text-[#a0afb9]">{appointment.service_name} <span className="mx-1 text-[#c5cbc5] dark:text-[#50616d]">·</span> {appointment.duration_minutes} min</p>
                                            <p className="mt-1 text-xs text-[#89938d] dark:text-[#94a4af]">{appointment.dentist_name}{appointment.patient.phone ? ` · ${appointment.patient.phone}` : ''}</p>
                                            {appointment.notes && <p className="mt-2 text-sm text-[#6f7a73] dark:text-[#a0afb9]">{appointment.notes}</p>}
                                        </div>
                                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                                            <select
                                                aria-label={`Estado de la cita de ${appointment.patient.name}`}
                                                value={appointment.status}
                                                onChange={(event) => updateStatus(appointment, event.target.value)}
                                                disabled={['completed', 'cancelled', 'no_show'].includes(appointment.status)}
                                                className="h-9 max-w-40 rounded-lg border border-[#dfe4de] bg-white px-2 text-xs font-medium text-[#536159] disabled:opacity-60 dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#d4e0e8]"
                                            >
                                                <option value={appointment.status}>{statusLabels[appointment.status] ?? appointment.status}</option>
                                                {appointment.status === 'scheduled' && <option value="confirmed">Confirmada</option>}
                                                {appointment.status === 'confirmed' && <option value="completed">Completada</option>}
                                                {['scheduled', 'confirmed'].includes(appointment.status) && <option value="cancelled">Cancelada</option>}
                                                {['scheduled', 'confirmed'].includes(appointment.status) && <option value="no_show">No asistió</option>}
                                            </select>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-14 text-center">
                                <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#e8eef4] text-[#496d88] dark:bg-[#293a47] dark:text-[#a9c9df]"><CalendarDays size={22} /></span>
                                <h3 className="font-semibold">{search ? 'No hay resultados' : 'No hay citas para este día'}</h3>
                                <p className="mt-1 max-w-sm text-sm text-[#7a857e] dark:text-[#9aaab4]">{search ? 'Prueba con otro nombre, tratamiento u odontólogo.' : 'Cuando registres una cita, aparecerá aquí en orden de horario.'}</p>
                                {!search && patients.length > 0 && <button type="button" onClick={() => setIsFormOpen(true)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#416984] dark:text-[#a9c9df]"><Plus size={16} /> Agendar primera cita</button>}
                                {!search && patients.length === 0 && <Link href="/admin/patients" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#416984] dark:text-[#a9c9df]"><Plus size={16} /> Agregar primer paciente</Link>}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-30 flex items-end justify-center bg-[#15221d]/45 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsFormOpen(false); }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="appointment-form-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 text-[#1e2925] shadow-2xl dark:bg-[#1c2730] dark:text-[#e5edf2] sm:max-w-xl sm:rounded-xl sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#728078] dark:text-[#a0afb9]">Agenda clínica</p>
                                <h2 id="appointment-form-title" className="mt-1 text-xl font-semibold">Nueva cita</h2>
                            </div>
                            <button type="button" onClick={() => setIsFormOpen(false)} aria-label="Cerrar formulario" className="flex size-9 items-center justify-center rounded-lg text-[#748078] hover:bg-[#f1f4f0] dark:text-[#a0afb9] dark:hover:bg-[#293740]"><X size={18} /></button>
                        </div>
                        <form onSubmit={submitAppointment} className="grid gap-4">
                            <label className="grid gap-1.5 text-sm font-medium">Paciente
                                <select value={form.data.patient_id} onChange={(event) => form.setData('patient_id', event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] bg-white px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required>
                                    <option value="">Seleccionar paciente</option>
                                    {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}{patient.phone ? ` · ${patient.phone}` : ''}</option>)}
                                </select>
                                {form.errors.patient_id && <span className="text-xs font-normal text-rose-700">{form.errors.patient_id}</span>}
                            </label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="grid gap-1.5 text-sm font-medium">Odontólogo
                                    <select value={form.data.dentist_id} onChange={(event) => form.setData('dentist_id', event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] bg-white px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required>
                                        <option value="">Seleccionar odontólogo</option>
                                        {dentists.map((dentist) => <option key={dentist.id} value={dentist.id}>{dentist.name}</option>)}
                                    </select>
                                    {form.errors.dentist_id && <span className="text-xs font-normal text-rose-700">{form.errors.dentist_id}</span>}
                                </label>
                                <label className="grid gap-1.5 text-sm font-medium">Tratamiento
                                    <input value={form.data.service_name} onChange={(event) => form.setData('service_name', event.target.value)} placeholder="Limpieza dental" className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2] dark:placeholder:text-[#788a96]" required />
                                    {form.errors.service_name && <span className="text-xs font-normal text-rose-700">{form.errors.service_name}</span>}
                                </label>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="grid gap-1.5 text-sm font-medium">Fecha y hora
                                    <input type="datetime-local" value={form.data.starts_at} onChange={(event) => form.setData('starts_at', event.target.value)} min={new Date().toISOString().slice(0, 16)} className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                                    {form.errors.starts_at && <span className="text-xs font-normal text-rose-700">{form.errors.starts_at}</span>}
                                </label>
                                <label className="grid gap-1.5 text-sm font-medium">Duración
                                    <select value={form.data.duration_minutes} onChange={(event) => form.setData('duration_minutes', event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] bg-white px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]">
                                        {[15, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutos</option>)}
                                    </select>
                                </label>
                            </div>
                            <label className="grid gap-1.5 text-sm font-medium">Notas <span className="font-normal text-[#89938d]">(opcional)</span>
                                <textarea value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} rows="3" placeholder="Indicaciones para la consulta" className="resize-y rounded-lg border border-[#dfe4de] px-3 py-2 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2] dark:placeholder:text-[#788a96]" />
                                {form.errors.notes && <span className="text-xs font-normal text-rose-700">{form.errors.notes}</span>}
                            </label>
                            {form.errors.starts_at && <p role="alert" className="text-sm text-rose-700">Revisa el horario: puede estar ocupado o ser una fecha pasada.</p>}
                            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-[#edf0ec] pt-4 dark:border-[#344550] sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="h-10 rounded-lg border border-[#dfe4de] px-4 text-sm font-medium text-[#59665e] dark:border-[#3a4a55] dark:text-[#c0cbd3]">Cancelar</button>
                                <button type="submit" disabled={form.processing} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-[#527e9d]"><Check size={16} /> {form.processing ? 'Guardando…' : 'Guardar cita'}</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}