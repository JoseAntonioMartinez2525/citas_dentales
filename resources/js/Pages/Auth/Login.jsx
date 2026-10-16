import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';

export default function Login() {
    const form = useForm({ email: '', password: '' });

    function submit(event) {
        event.preventDefault();
        form.post('/login', { onFinish: () => form.reset('password') });
    }

    return (
        <>
            <Head title="Acceso del personal" />
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
                <main className="mx-auto max-w-md px-4 py-12 sm:py-16">
                    <section className="rounded-xl border border-[#e2e6e0] bg-white p-6 dark:border-[#344550] dark:bg-[#1c2730] sm:p-8">
                        <p className="inline-flex items-center gap-2 text-sm font-medium text-[#5f7890] dark:text-[#a9c9df]"><LockKeyhole size={16} /> Acceso administrativo</p>
                        <h1 className="mt-2 text-2xl font-semibold">Iniciar sesión</h1>
                        <p className="mt-2 text-sm text-[#728078] dark:text-[#a0afb9]">Ingresa con la cuenta de personal de la clínica.</p>
                        <form onSubmit={submit} className="mt-6 grid gap-4">
                            <label className="grid gap-1.5 text-sm font-medium">Correo electrónico
                                <input autoComplete="username" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                                {form.errors.email && <span role="alert" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.email}</span>}
                            </label>
                            <label className="grid gap-1.5 text-sm font-medium">Contraseña
                                <input autoComplete="current-password" type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} className="h-11 rounded-lg border border-[#dfe4de] px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]" required />
                            </label>
                            <button type="submit" disabled={form.processing} className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white hover:bg-[#31556f] disabled:opacity-60 dark:bg-[#527e9d] dark:hover:bg-[#628ca9]"><LogIn size={16} /> {form.processing ? 'Verificando…' : 'Entrar'}</button>
                        </form>
                        <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#416984] dark:text-[#a9c9df]"><ArrowLeft size={15} /> Volver a reservas</Link>
                    </section>
                </main>
            </div>
        </>
    );
}