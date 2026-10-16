import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Check, Home } from 'lucide-react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';

export default function Success({ appointment, hasPatientPortal }) {
    return (
        <>
            <Head title="Solicitud recibida" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <header className="border-b border-[#e2e6e0] bg-[#fbfcfd] dark:border-[#344550] dark:bg-[#1a242c]">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-7">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                            <span className="text-sm font-bold">Clínica del Toro</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="mx-auto max-w-xl px-4 py-12 sm:px-7 sm:py-16">
                    <section className="rounded-xl border border-[#e2e6e0] bg-white p-6 text-center dark:border-[#344550] dark:bg-[#1c2730] sm:p-9">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8eef4] text-[#416984] dark:bg-[#293a47] dark:text-[#a9c9df]"><CalendarCheck size={26} /></span>
                        <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#416984] dark:text-[#a9c9df]"><Check size={16} /> Solicitud registrada</p>
                        <h1 className="mt-2 text-2xl font-semibold">Gracias, {appointment.patient_name}</h1>
                        <p className="mt-2 text-sm text-[#728078] dark:text-[#a0afb9]">La cita quedó en la agenda de demostración.</p>
                        <dl className="mt-6 grid gap-3 rounded-lg bg-[#f3f5f7] p-4 text-left dark:bg-[#141d24]">
                            <div className="flex justify-between gap-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Referencia</dt><dd className="font-semibold">{appointment.reference}</dd></div>
                            <div className="flex justify-between gap-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Servicio</dt><dd className="font-semibold">{appointment.service}</dd></div>
                            <div className="flex justify-between gap-3 text-sm"><dt className="text-[#728078] dark:text-[#a0afb9]">Fecha y hora</dt><dd className="font-semibold">{appointment.starts_at}</dd></div>
                        </dl>
                        {hasPatientPortal && <p className="mt-4 text-xs leading-5 text-[#728078] dark:text-[#a0afb9]">El enlace de “Mis citas” es privado: quien lo tenga puede consultar o cancelar las citas vinculadas. Guárdalo en un lugar seguro; puedes revocarlo desde el portal.</p>}
                        <p className="mt-4 text-xs text-[#87918b] dark:text-[#899ba7]">Esta confirmación es parte de un prototipo con datos ficticios.</p>
                        {hasPatientPortal && <Link href={`/mis-citas/${appointment.portal_token}`} className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white hover:bg-[#31556f] dark:bg-[#527e9d] dark:hover:bg-[#628ca9]">Consultar o cancelar citas</Link>}
                        <Link href="/" className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4de] px-4 text-sm font-semibold text-[#536159] dark:border-[#3a4a55] dark:text-[#c0cbd3]"><Home size={16} /> Volver a reservar</Link>
                    </section>
                </main>
            </div>
        </>
    );
}