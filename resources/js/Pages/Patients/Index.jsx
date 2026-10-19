import { Head, Link, router, useForm } from '@inertiajs/react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';
import { ChevronLeft, ChevronRight, Clock3, FilePlus2, Search, UserRound, Users, X } from 'lucide-react';
import { useState } from 'react';

function initials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toLocaleUpperCase('es');
}

export default function Index({ patients, filters, totalPatients, flash = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const form = useForm({ name: '', phone: '', email: '', birth_date: '', notes: '' });

    function submitSearch(event) {
        event.preventDefault();
        router.get('/patients', { search }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function submitPatient(event) {
        event.preventDefault();
        form.post('/admin/patients', {
            preserveScroll: true,
            onSuccess: () => {
                setIsFormOpen(false);
                form.reset();
            },
        });
    }

    return (
        <>
            <Head title="Pacientes" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#e1e5df] bg-[#fbfcfd] px-5 py-6 dark:border-[#344550] dark:bg-[#1a242c] lg:flex lg:flex-col">
                    <Link href="/admin" className="flex items-center gap-3" aria-label="Clínica del Toro, panel administrativo">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                        <span><span className="block text-sm font-bold">Clínica del Toro</span><span className="block text-xs text-[#748078]">Gestión dental</span></span>
                    </Link>
                    <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87918b] dark:text-[#94a4af]">Espacio de trabajo</p>
                    <nav className="grid gap-1" aria-label="Navegación principal">
                        <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><FilePlus2 size={18} /> Agenda</Link>
                        <Link href="/admin/patients" className="flex items-center gap-3 rounded-lg bg-[#e8eef4] px-3 py-2.5 text-sm font-semibold text-[#416984] dark:bg-[#293a47] dark:text-[#c3daea]"><UserRound size={18} /> Pacientes</Link>
                        <Link href="/admin/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><Clock3 size={18} /> Servicios</Link>
                    </nav>
                    <div className="mt-auto border-t border-[#e7eae5] pt-5 dark:border-[#344550]">
                        <div className="flex items-center gap-3 px-2">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#dce7ef] text-sm font-semibold text-[#365c78] dark:bg-[#293a47] dark:text-[#c3daea]">CT</span>
                            <span><span className="block text-sm font-semibold">Clínica del Toro</span><span className="block text-xs text-[#7e8982] dark:text-[#9aaab4]">Administración</span></span>
                        </div>
                    </div>
                </aside>

                <main className="mx-auto max-w-7xl px-4 py-5 sm:px-7 sm:py-8 lg:ml-64 lg:px-10">
                    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e6e0] pb-5 dark:border-[#344550]">
                        <div className="flex items-center gap-2 lg:hidden">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-[18px]" /></span>
                            <span className="text-sm font-bold">Clínica del Toro</span>
                        </div>
                        <nav className="flex items-center gap-4 text-sm lg:hidden" aria-label="Navegación principal">
                            <Link href="/admin" className="text-[#65716a] dark:text-[#a9b6bf]">Agenda</Link>
                            <Link href="/admin/patients" className="font-semibold text-[#416984] dark:text-[#a9c9df]">Pacientes</Link>
                            <Link href="/admin/services" className="text-[#65716a] dark:text-[#a9b6bf]">Servicios</Link>
                        </nav>
                        <div className="hidden text-sm text-[#7a857e] dark:text-[#9aaab4] lg:block">Directorio clínico</div>
                        <ThemeToggle />
                        <Link href="/admin/logout" method="post" as="button" className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium text-[#536159] dark:border-[#3a4a55] dark:text-[#c0cbd3]">Cerrar sesión</Link>
                        <button type="button" onClick={() => setIsFormOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white transition hover:bg-[#31556f] dark:bg-[#527e9d] dark:hover:bg-[#628ca9]"><Users size={16} /> Nuevo paciente</button>
                    </header>

                    <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-sm font-medium text-[#6d7971] dark:text-[#a0afb9]">Fichas clínicas</p>
                            <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Pacientes</h1>
                            <p className="mt-2 text-sm text-[#6d7971] dark:text-[#a0afb9]">Directorio e información de contacto</p>
                        </div>
                        <div className="rounded-lg border border-[#e2e6e0] bg-white px-4 py-3 dark:border-[#344550] dark:bg-[#1c2730]">
                            <p className="text-xs text-[#7a857e] dark:text-[#9aaab4]">Pacientes registrados</p>
                            <p className="mt-0.5 text-xl font-semibold tabular-nums">{totalPatients}</p>
                        </div>
                    </section>

                    {flash.success && <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{flash.success}</div>}

                    <section className="overflow-hidden rounded-xl border border-[#e2e6e0] bg-white dark:border-[#344550] dark:bg-[#1c2730]">
                        <div className="flex flex-col gap-4 border-b border-[#e9ece8] px-4 py-4 dark:border-[#344550] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div><h2 className="text-base font-semibold">Directorio</h2><p className="mt-1 text-sm text-[#7a857e] dark:text-[#9aaab4]">{patients.total} {patients.total === 1 ? 'ficha' : 'fichas'}</p></div>
                            <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
                                <label className="relative block min-w-0 flex-1 sm:w-64">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87918b] dark:text-[#94a4af]" />
                                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, teléfono o correo" aria-label="Buscar pacientes" className="h-10 w-full rounded-lg border border-[#dfe4de] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#6f86a0] focus:ring-2 focus:ring-[#dce6ef] dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2] dark:placeholder:text-[#788a96] dark:focus:border-[#6e94af] dark:focus:ring-[#304757]" />
                                </label>
                                <button type="submit" className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium text-[#536159] hover:bg-[#f7f9f6] dark:border-[#3a4a55] dark:text-[#c0cbd3] dark:hover:bg-[#263640]">Buscar</button>
                            </form>
                        </div>

                        {patients.data.length > 0 ? (
                            <>
                                <div className="divide-y divide-[#edf0ec] dark:divide-[#344550]">
                                    {patients.data.map((patient) => (
                                        <article key={patient.id} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8eef4] text-xs font-semibold text-[#416984] dark:bg-[#293a47] dark:text-[#c3daea]">{initials(patient.name)}</span>
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/admin?patient_id=${patient.id}`}
                                                    className="truncate text-sm font-semibold text-[#416984] hover:underline dark:text-[#a9c9df] dark:hover:text-[#c0cbd3]"
                                                >
                                                    {patient.name}
                                                </Link>
                                                <p className="mt-1 truncate text-sm text-[#718078] dark:text-[#a0afb9]">{patient.email || 'Sin correo registrado'}</p>
                                            </div>
                                            <a href={`tel:${patient.phone}`} className="shrink-0 text-right text-sm font-medium text-[#416984] hover:underline dark:text-[#a9c9df]">{patient.phone}</a>
                                        </article>
                                    ))}
                                </div>
                                {patients.links.length > 3 && (
                                    <nav aria-label="Paginación de pacientes" className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e9ece8] px-4 py-4 dark:border-[#344550] sm:px-6">
                                        <p className="text-sm text-[#7a857e] dark:text-[#9aaab4]">Mostrando {patients.from}–{patients.to} de {patients.total}</p>
                                        <div className="flex items-center gap-1">
                                            {patients.links.map((link, index) => {
                                                if (index === 0 || index === patients.links.length - 1) {
                                                    return link.url ? <Link key={index} href={link.url} preserveScroll aria-label={index === 0 ? 'Página anterior' : 'Página siguiente'} className="flex size-9 items-center justify-center rounded-lg border border-[#dfe4de] text-[#536159] hover:bg-[#f7f9f6] dark:border-[#3a4a55] dark:text-[#c0cbd3] dark:hover:bg-[#263640]">{index === 0 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</Link> : <span key={index} className="flex size-9 items-center justify-center rounded-lg border border-[#edf0ec] text-[#b1b9b3] dark:border-[#344550] dark:text-[#647580]">{index === 0 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</span>;
                                                }

                                                return link.url ? <Link key={index} href={link.url} preserveScroll className={`flex size-9 items-center justify-center rounded-lg text-sm ${link.active ? 'bg-[#416984] font-semibold text-white dark:bg-[#527e9d]' : 'text-[#65716a] hover:bg-[#f1f4f0] dark:text-[#a9b6bf] dark:hover:bg-[#25333c]'}`}>{link.label}</Link> : null;
                                            })}
                                        </div>
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-14 text-center">
                                <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#e8eef4] text-[#496d88] dark:bg-[#293a47] dark:text-[#a9c9df]"><Users size={22} /></span>
                                <h3 className="font-semibold">{filters.search ? 'No encontramos pacientes' : 'Aún no hay pacientes'}</h3>
                                <p className="mt-1 max-w-sm text-sm text-[#7a857e] dark:text-[#9aaab4]">{filters.search ? 'Prueba con otro nombre, teléfono o correo.' : 'Registra a tus pacientes para comenzar a organizar las citas.'}</p>
                                {!filters.search && <button type="button" onClick={() => setIsFormOpen(true)} className="mt-5 text-sm font-semibold text-[#416984] dark:text-[#a9c9df]">Agregar primer paciente</button>}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-30 flex items-end justify-center bg-[#15221d]/45 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsFormOpen(false); }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="patient-form-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 text-[#1e2925] shadow-2xl dark:bg-[#1c2730] dark:text-[#e5edf2] sm:max-w-xl sm:rounded-xl sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div><p className="text-sm font-medium text-[#728078] dark:text-[#a0afb9]">Directorio clínico</p><h2 id="patient-form-title" className="mt-1 text-xl font-semibold">Nuevo paciente</h2></div>
                            <button type="button" onClick={() => setIsFormOpen(false)} aria-label="Cerrar formulario" className="flex size-9 items-center justify-center rounded-lg text-[#748078] hover:bg-[#f1f4f0] dark:text-[#a0afb9] dark:hover:bg-[#293740]"><X size={18} /></button>
                        </div>
                        <form onSubmit={submitPatient} className="grid gap-4">
                            <label className="grid gap-1.5 text-sm font-medium">Nombre completo
                                <input autoFocus value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} autoComplete="name" className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                                {form.errors.name && <span className="text-xs font-normal text-rose-700">{form.errors.name}</span>}
                            </label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="grid gap-1.5 text-sm font-medium">Teléfono
                                    <input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} autoComplete="tel" type="tel" className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                                    {form.errors.phone && <span className="text-xs font-normal text-rose-700">{form.errors.phone}</span>}
                                </label>
                                <label className="grid gap-1.5 text-sm font-medium">Correo <span className="font-normal text-[#89938d]">(opcional)</span>
                                    <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoComplete="email" type="email" className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" />
                                    {form.errors.email && <span className="text-xs font-normal text-rose-700">{form.errors.email}</span>}
                                </label>
                            </div>
                            <label className="grid gap-1.5 text-sm font-medium">Fecha de nacimiento <span className="font-normal text-[#89938d]">(opcional)</span>
                                <input type="date" max={new Date().toLocaleDateString('en-CA')} value={form.data.birth_date} onChange={(event) => form.setData('birth_date', event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" />
                                {form.errors.birth_date && <span className="text-xs font-normal text-rose-700">{form.errors.birth_date}</span>}
                            </label>
                            <label className="grid gap-1.5 text-sm font-medium">Notas <span className="font-normal text-[#89938d]">(opcional)</span>
                                <textarea rows="3" value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} placeholder="Antecedentes o indicaciones relevantes" className="resize-y rounded-lg border border-[#dfe4de] px-3 py-2 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2] dark:placeholder:text-[#788a96]" />
                                {form.errors.notes && <span className="text-xs font-normal text-rose-700">{form.errors.notes}</span>}
                            </label>
                            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-[#edf0ec] pt-4 dark:border-[#344550] sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="h-10 rounded-lg border border-[#dfe4de] px-4 text-sm font-medium text-[#59665e] dark:border-[#3a4a55] dark:text-[#c0cbd3]">Cancelar</button>
                                <button type="submit" disabled={form.processing} className="h-10 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-[#527e9d]">{form.processing ? 'Guardando…' : 'Guardar paciente'}</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}