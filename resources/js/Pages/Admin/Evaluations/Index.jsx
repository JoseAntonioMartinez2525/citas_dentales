import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ClipboardCheck, Clock3, UserRound } from 'lucide-react';
import DentalMark from '../../../Components/DentalMark';
import ThemeToggle from '../../../Components/ThemeToggle';

const cardNames = {
    book_appointment: 'Agendar una cita',
    services: 'Consultar servicios dentales',
    patient_appointments: 'Consultar mis citas',
    cancel_appointment: 'Cancelar una cita',
    clinic_schedule: 'Consultar horarios de atención',
    staff_agenda: 'Ver agenda de la clínica',
    patients: 'Administrar pacientes',
    staff_services: 'Administrar servicios',
};

export default function Index({ cardSortingResponses, susResponsesCount, susAverageScore }) {
    return (
        <>
            <Head title="Resultados de evaluaciones" />
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
                        <Link href="/admin/evaluaciones" aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#e8eef4] px-3 py-2.5 text-sm font-semibold text-[#416984] dark:bg-[#293a47] dark:text-[#c3daea]"><ClipboardCheck size={18} /> Evaluaciones</Link>
                    </nav>
                </aside>
                <main className="mx-auto max-w-5xl px-4 py-5 sm:px-7 sm:py-8 lg:ml-64 lg:px-10">
                    <nav className="mb-5 flex flex-wrap gap-4 text-sm lg:hidden" aria-label="Navegación principal">
                        <Link href="/admin" className="text-[#65716a] dark:text-[#a9b6bf]">Agenda</Link>
                        <Link href="/admin/services" className="text-[#65716a] dark:text-[#a9b6bf]">Servicios</Link>
                        <Link href="/admin/schedules" className="text-[#65716a] dark:text-[#a9b6bf]">Horarios</Link>
                    </nav>
                    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e6e0] pb-5 dark:border-[#344550]">
                        <div>
                            <p className="text-sm text-[#728078] dark:text-[#a0afb9]">Resultados recopilados de forma anónima</p>
                            <h1 className="text-3xl font-semibold">Evaluaciones</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link href="/admin/logout" method="post" as="button" className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium dark:border-[#3a4a55]">Cerrar sesión</Link>
                        </div>
                    </header>
                    <section aria-label="Resumen SUS" className="mb-6 grid gap-4 sm:grid-cols-2">
                        <article className="rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730]">
                            <p className="text-sm text-[#728078] dark:text-[#a0afb9]">Cuestionarios SUS respondidos</p>
                            <p className="mt-2 text-3xl font-semibold">{susResponsesCount}</p>
                        </article>
                        <article className="rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730]">
                            <p className="text-sm text-[#728078] dark:text-[#a0afb9]">Promedio SUS</p>
                            <p className="mt-2 text-3xl font-semibold">{susAverageScore === null ? '—' : `${susAverageScore} / 100`}</p>
                        </article>
                    </section>
                    <section>
                        <h2 className="mb-4 text-xl font-semibold">Clasificaciones Card Sorting ({cardSortingResponses.length} recientes)</h2>
                        <div className="grid gap-4">
                            {cardSortingResponses.map((response, index) => (
                                <article key={response.id} className="rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730]">
                                    <h3 className="font-semibold">Participación {index + 1}</h3>
                                    <p className="mt-1 text-xs text-[#728078] dark:text-[#a0afb9]">{new Date(response.submitted_at).toLocaleString('es')}</p>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {response.groups.map((group, groupIndex) => (
                                            <section key={`${response.id}-${groupIndex}`} className="rounded-lg bg-[#f3f5f7] p-3 dark:bg-[#141d24]">
                                                <h4 className="text-sm font-semibold">{group.name}</h4>
                                                <ul className="mt-2 list-inside list-disc text-sm text-[#6d7971] dark:text-[#a0afb9]">
                                                    {group.cards.map((cardId) => <li key={cardId}>{cardNames[cardId] ?? cardId}</li>)}
                                                </ul>
                                            </section>
                                        ))}
                                    </div>
                                </article>
                            ))}
                            {cardSortingResponses.length === 0 && <p className="rounded-xl border border-dashed border-[#cbd4dc] p-8 text-center text-sm text-[#728078] dark:border-[#3a4a55] dark:text-[#a0afb9]">Todavía no hay clasificaciones registradas.</p>}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
