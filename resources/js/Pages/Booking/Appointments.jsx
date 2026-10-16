import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, Check, CircleAlert, Clock3, LogOut, Stethoscope } from 'lucide-react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';

const statusLabels = {
    scheduled: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

const statusClasses = {
    scheduled: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
    confirmed: 'bg-[#e8eef4] text-[#365c78] dark:bg-[#293a47] dark:text-[#c3daea]',
    completed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
};

export default function Appointments({ appointments, cancellationDeadlineHours, flash = {} }) {
    const { errors } = usePage().props;

    function cancelAppointment(appointment) {
        if (!window.confirm(`¿Cancelar la cita de ${appointment.service_name}?`)) {
            return;
        }

        router.post(`/mis-citas/${appointment.id}/cancelar`, {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Mis citas" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <header className="border-b border-[#e2e6e0] bg-[#fbfcfd] dark:border-[#344550] dark:bg-[#1a242c]">
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-7">
                        <Link href="/" className="flex items-center gap-3" aria-label="Clínica del Toro, volver a reservar">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                            <span><span className="block text-sm font-bold">Clínica del Toro</span><span className="block text-xs text-[#748078] dark:text-[#9aaab4]">Mis citas</span></span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Link href="/mis-citas/salir" method="post" as="button" aria-label="Revocar acceso al portal" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium text-[#536159] dark:border-[#3a4a55] dark:text-[#c0cbd3]"><LogOut size={15} /><span><span className="hidden sm:inline">Revocar acceso</span><span className="sr-only sm:hidden">Revocar acceso</span></span></Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-7 sm:py-12">
                    <section className="mb-7">
                        <p className="mb-2 text-sm font-medium text-[#5f7890] dark:text-[#a9c9df]">Portal de paciente</p>
                        <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Tus citas</h1>
                        <p className="mt-2 text-sm text-[#6d7971] dark:text-[#a0afb9]">Este enlace privado identifica tus citas. Revócalo al terminar si usas un dispositivo compartido.</p>
                    </section>

                    {flash.success && <p role="status" className="mb-5 rounded-lg border border-[#c8d7e2] bg-[#e8eef4] px-4 py-3 text-sm text-[#365c78] dark:border-[#40576a] dark:bg-[#293a47] dark:text-[#c3daea]">{flash.success}</p>}
                    {errors.appointment && <p role="alert" className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"><CircleAlert size={17} className="mt-0.5 shrink-0" />{errors.appointment}</p>}

                    {appointments.length ? (
                        <section className="overflow-hidden rounded-xl border border-[#e2e6e0] bg-white dark:border-[#344550] dark:bg-[#1c2730]">
                            <div className="border-b border-[#e9ece8] px-5 py-4 dark:border-[#344550] sm:px-6">
                                <h2 className="font-semibold">Historial de citas</h2>
                                <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">Puedes cancelar hasta {cancellationDeadlineHours} horas antes del inicio.</p>
                            </div>
                            <div className="divide-y divide-[#edf0ec] dark:divide-[#344550]">
                                {appointments.map((appointment) => (
                                    <article key={appointment.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold">{appointment.service_name}</h3>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[appointment.status] ?? statusClasses.scheduled}`}>{statusLabels[appointment.status] ?? appointment.status}</span>
                                            </div>
                                            <p className="mt-2 flex items-center gap-2 text-sm text-[#6f7a73] dark:text-[#a0afb9]"><CalendarDays size={15} />{appointment.starts_at}</p>
                                            <p className="mt-1 flex items-center gap-2 text-xs text-[#89938d] dark:text-[#94a4af]"><Clock3 size={14} />{appointment.duration_minutes} minutos</p>
                                        </div>
                                        {appointment.can_cancel && (
                                            <button type="button" onClick={() => cancelAppointment(appointment)} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-rose-200 px-3 text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/40 sm:self-auto">
                                                Cancelar cita
                                            </button>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="flex flex-col items-center rounded-xl border border-[#e2e6e0] bg-white px-6 py-14 text-center dark:border-[#344550] dark:bg-[#1c2730]">
                            <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#e8eef4] text-[#496d88] dark:bg-[#293a47] dark:text-[#a9c9df]"><Stethoscope size={22} /></span>
                            <h2 className="font-semibold">No hay citas todavía</h2>
                            <p className="mt-1 text-sm text-[#7a857e] dark:text-[#9aaab4]">Al reservar, podrás consultar aquí tus horarios y estados.</p>
                        </section>
                    )}

                    <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#87918b] dark:text-[#899ba7]"><Check size={15} className="mt-0.5 shrink-0" />Si faltan menos de {cancellationDeadlineHours} horas, contacta al consultorio para solicitar un cambio. No incluyas información clínica en el prototipo.</div>
                    <Link href="/" className="mt-5 inline-flex h-10 items-center rounded-lg border border-[#dfe4de] px-4 text-sm font-medium text-[#536159] dark:border-[#3a4a55] dark:text-[#c0cbd3]">Agendar otra cita</Link>
                </main>
            </div>
        </>
    );
}