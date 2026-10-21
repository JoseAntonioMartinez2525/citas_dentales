# Credenciales de acceso - Clínica del Toro

Solo los administradores usan la contraseña `password`. Todos los demás usuarios tienen una contraseña única basada en su nombre y el año actual (2026).

## Administradores

| Nombre | Rol | Correo electrónico | Contraseña |
|--------|-----|-------------------|------------|
| Administrador | Administrador del sistema | admin@clinicadental.com | password |
| Miguel Ángel Torres | Administrador de clínica | miguel.torres@clinicadental.com | password |

## Empleados de la clínica (contraseñas únicas)

| Nombre | Rol | Correo electrónico | Contraseña |
|--------|-----|-------------------|------------|
| Roberto Méndez | Dentista | roberto.mendez@clinicadental.com | roberto2026 |
| Julián Ortega | Dentista | julian.ortega@clinicadental.com | julian2026 |
| Carlos Ramírez | Recepcionista | carlos.ramirez@clinicadental.com | carlos2026 |
| Sofía Herrera | Asistente dental | sofia.herrera@clinicadental.com | sofia2026 |

## Pacientes (contraseñas únicas)

| Nombre | Rol | Correo electrónico | Contraseña |
|--------|-----|-------------------|------------|
| María González | Paciente | maria.gonzalez@clinicadental.com | maria2026 |
| Ana López | Paciente | ana.lopez@clinicadental.com | ana2026 |
| Diego Castro | Paciente | diego.castro@clinicadental.com | diego2026 |
| Laura Fernández | Paciente | laura.fernandez@clinicadental.com | laura2026 |
| Patricia Rojas | Paciente | patricia.rojas@clinicadental.com | patricia2026 |

## Notas

- Los usuarios se insertan mediante `database/seeders/DatabaseSeeder.php` usando `firstOrCreate`, por lo que si ya existen no se duplican.
- Para ejecutar el seeder es necesario tener **PHP 8.3+** instalado en Laragon (el proyecto lo requiere).
- El campo `is_admin` permite acceso al panel administrativo en `/admin`.

## Cómo aplicar los cambios

Una vez actualices PHP a 8.3 en Laragon, ejecuta:

```bash
php artisan migrate
php artisan db:seed --class=DatabaseSeeder
```
