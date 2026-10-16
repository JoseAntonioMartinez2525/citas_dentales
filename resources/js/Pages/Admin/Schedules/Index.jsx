import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDays, Clock3, Plus, Save, UserRound } from 'lucide-react';
import { useState } from 'react';
import DentalMark from '../../../Components/DentalMark';
import ThemeToggle from '../../../Components/ThemeToggle';

const weekdayNames = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

function scheduleFormData(schedules) {
    return {
        schedules: weekdayNames.map((_, index) => {
            const weekday = index + 1;
            const schedule = schedules.find((item) => item.weekday === weekday);

            return {
                weekday,
                is_open: Boolean(schedule),
                opens_at: schedule?.opens_at?.slice(0, 5) ?? '08:00',
                closes_at: schedule?.closes_at?.slice(0, 5) ?? '18:00',
            };
        }),
    };
}

function DentistCard({ dentist }) {
    const scheduleForm = useForm(scheduleFormData(dentist.schedules));
    const dentistForm = useForm({ name: dentist.name, is_active: dentist.is_active });

    function updateSchedule(index, field, value) {
        scheduleForm.setData('schedules', scheduleForm.data.schedules.map((day, dayIndex) => (
            dayIndex === index ? { ...day, [field]: value } : day
        )));
    }

    function submitSchedules(event) {
        event.preventDefault();
        scheduleForm.put(`/admin/dentists/${dentist.id}/schedules`, { preserveScroll: true });
    }

    function submitDentist(event) {
        event.preventDefault();
        dentistForm.put(`/admin/dentists/${dentist.id}`, { preserveScroll: true });
    }

    return (
        <section className="rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730] sm:p-7">
            <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{dentist.name}</h2>
                    <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">
                        {dentist.is_active ? 'Puede recibir nuevas citas' : 'Inactivo; no aparece en la reserva pública'}
                    </p>
                </div>
                <form onSubmit={submitDentist} className="flex flex-wrap items-end gap-2">
                    <label className="grid gap-1 text-xs font-medium">
                        Nombre
                        <input
                            value={dentistForm.data.name}
                            onChange={(event) => dentistForm.setData('name', event.target.value)}
                            aria-label={`Nombre de ${dentist.name}`}
                            className="h-10 w-48 rounded-lg border border-[#dfe4de] bg-white px-3 text-sm dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                            required
                        />
                    </label>
                    <label className="flex h-10 items-center gap-2 rounded-lg border border-[#dfe4de] px-3 text-sm dark:border-[#3a4a55]">
                        <input
                            type="checkbox"
                            checked={dentistForm.data.is_active}
                            onChange={(event) => dentistForm.setData('is_active', event.target.checked)}
                        />
                        Activo
                    </label>
                    <button type="submit" disabled={dentistForm.processing} className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium disabled:opacity-60 dark:border-[#3a4a55]">
                        Guardar datos
                    </button>
                    {dentistForm.errors.name && <span role="alert" className="w-full text-xs text-rose-700">{dentistForm.errors.name}</span>}
                </form>
            </header>

            <form onSubmit={submitSchedules}>
                <fieldset className="grid gap-3">
                    <legend className="mb-3 text-sm font-semibold">Días y horas de atención</legend>
                    {scheduleForm.data.schedules.map((day, index) => (
                        <div key={day.weekday} className="grid gap-3 rounded-lg border border-[#edf0ec] p-3 dark:border-[#344550] sm:grid-cols-[minmax(120px,1fr)_repeat(2,minmax(130px,1fr))] sm:items-center">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={day.is_open}
                                    onChange={(event) => updateSchedule(index, 'is_open', event.target.checked)}
                                />
                                {weekdayNames[index]}
                            </label>
                            <label className="grid gap-1 text-xs text-[#728078] dark:text-[#a0afb9]">
                                Abre
                                <input
                                    type="time"
                                    value={day.opens_at}
                                    disabled={!day.is_open}
                                    onChange={(event) => updateSchedule(index, 'opens_at', event.target.value)}
                                    className="h-10 rounded-lg border border-[#dfe4de] bg-white px-2 text-sm text-[#1e2925] disabled:opacity-50 dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                />
                            </label>
                            <label className="grid gap-1 text-xs text-[#728078] dark:text-[#a0afb9]">
                                Cierra
                                <input
                                    type="time"
                                    value={day.closes_at}
                                    disabled={!day.is_open}
                                    onChange={(event) => updateSchedule(index, 'closes_at', event.target.value)}
                                    className="h-10 rounded-lg border border-[#dfe4de] bg-white px-2 text-sm text-[#1e2925] disabled:opacity-50 dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                />
                            </label>
                            {scheduleForm.errors[`schedules.${index}.closes_at`] && <p role="alert" className="text-xs text-rose-700 sm:col-span-3">{scheduleForm.errors[`schedules.${index}.closes_at`]}</p>}
                        </div>
                    ))}
                </fieldset>
                {scheduleForm.errors.schedules && <p role="alert" className="mt-3 text-sm text-rose-700">{scheduleForm.errors.schedules}</p>}
                <button type="submit" disabled={scheduleForm.processing} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-[#527e9d]">
                    <Save size={16} /> Guardar horarios
                </button>
            </form>
        </section>
    );
}

export default function Index({ dentists, flash = {} }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const form = useForm({ name: '' });

    function submitDentist(event) {
        event.preventDefault();
        form.post('/admin/dentists', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setIsFormOpen(false);
            },
        });
    }

    return (
        <>
            <Head title="Horarios y odontólogos" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#e1e5df] bg-[#fbfcfd] px-5 py-6 dark:border-[#344550] dark:bg-[#1a242c] lg:flex lg:flex-col">
                    <Link href="/admin" className="flex items-center gap-3" aria-label="Clínica del Toro, panel administrativo">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                        <span><span className="block text-sm font-bold">Clínica del Toro</span><span className="block text-xs text-[#748078]">Gestión dental</span></span>
                    </Link>
                    <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87918b] dark:text-[#94a4af]">Espacio de trabajo</p>
                    <nav className="grid gap-1" aria-label="Navegación principal">
                        <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] dark:text-[#a9b6bf]"><CalendarDays size={18} /> Agenda</Link>
                        <Link href="/admin/patients" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] dark:text-[#a9b6bf]"><UserRound size={18} /> Pacientes</Link>
                        <Link href="/admin/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] dark:text-[#a9b6bf]"><Clock3 size={18} /> Servicios</Link>
                        <Link href="/admin/schedules" aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#e8eef4] px-3 py-2.5 text-sm font-semibold text-[#416984] dark:bg-[#293a47] dark:text-[#c3daea]"><Clock3 size={18} /> Horarios</Link>
                    </nav>
                </aside>
                <main className="mx-auto max-w-5xl px-4 py-5 sm:px-7 sm:py-8 lg:ml-64 lg:px-10">
                    <nav className="mb-5 flex flex-wrap gap-4 text-sm lg:hidden" aria-label="Navegación principal">
                        <Link href="/admin" className="text-[#65716a] dark:text-[#a9b6bf]">Agenda</Link>
                        <Link href="/admin/services" className="text-[#65716a] dark:text-[#a9b6bf]">Servicios</Link>
                        <Link href="/admin/evaluaciones" className="text-[#65716a] dark:text-[#a9b6bf]">Evaluaciones</Link>
                    </nav>
                    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e6e0] pb-5 dark:border-[#344550]">
                        <div>
                            <p className="text-sm text-[#728078] dark:text-[#a0afb9]">Administración</p>
                            <h1 className="text-3xl font-semibold tracking-[-0.02em]">Horarios y odontólogos</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link href="/admin/logout" method="post" as="button" className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium dark:border-[#3a4a55]">Cerrar sesión</Link>
                        </div>
                    </header>
                    {flash.success && <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">{flash.success}</p>}
                    <section className="mb-6 rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="font-semibold">Equipo dental</h2>
                                <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">Cada odontólogo tiene un calendario independiente para las reservas.</p>
                            </div>
                            <button type="button" onClick={() => setIsFormOpen((open) => !open)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white dark:bg-[#527e9d]">
                                <Plus size={16} /> Agregar odontólogo
                            </button>
                        </div>
                        {isFormOpen && (
                            <form onSubmit={submitDentist} className="mt-5 flex flex-wrap items-end gap-3 border-t border-[#edf0ec] pt-5 dark:border-[#344550]">
                                <label className="grid gap-1.5 text-sm font-medium">
                                    Nombre
                                    <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} aria-invalid={Boolean(form.errors.name)} className="h-11 w-full min-w-64 rounded-lg border border-[#dfe4de] px-3 dark:border-[#3a4a55] dark:bg-[#141d24]" required />
                                    {form.errors.name && <span role="alert" className="text-xs text-rose-700">{form.errors.name}</span>}
                                </label>
                                <button type="submit" disabled={form.processing} className="h-11 rounded-lg border border-[#dfe4de] px-4 text-sm font-medium disabled:opacity-60 dark:border-[#3a4a55]">Guardar odontólogo</button>
                            </form>
                        )}
                    </section>
                    <div className="grid gap-5">
                        {dentists.map((dentist) => <DentistCard key={dentist.id} dentist={dentist} />)}
                        {dentists.length === 0 && <p className="rounded-xl border border-dashed border-[#cbd4dc] p-8 text-center text-sm text-[#728078] dark:border-[#3a4a55] dark:text-[#a0afb9]">Todavía no hay odontólogos registrados.</p>}
                    </div>
                </main>
            </div>
        </>
    );
}
