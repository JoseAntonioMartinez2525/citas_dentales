<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f3f5f7">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}?v=2">
    <script>
        try {
            const savedTheme = localStorage.getItem('clinic-theme');
            const useDarkTheme = savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
            document.documentElement.classList.toggle('dark', useDarkTheme);
            document.querySelector('meta[name="theme-color"]').setAttribute('content', useDarkTheme ? '#121a20' : '#f3f5f7');
        } catch {
            document.documentElement.classList.remove('dark');
        }
    </script>
    <title inertia>{{ config('app.name', 'Citas Dentales') }}</title>
    @fonts
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <x-inertia::head />
</head>

<body>
    <x-inertia::app />
</body>

</html>