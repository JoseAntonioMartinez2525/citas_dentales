# Especificación Funcional Detallada — Sistema de Reserva de Citas Dentales

> Enlace de referencia: [Diseño e implementación de un sistema web para la programación de citas dentales centrado en la experiencia del paciente](Diseño%20e%20implementación%20de%20un%20sistema%20web%20para%20la%20programación%20de%20citas%20dentales%20centrado%20en%20la%20experiencia%20del%20paciente.md)

Este documento complementa el documento de diseño anteriormente referenciado. Proporciona la especificación funcional detallada, pasos algorítmicos, tipos de datos y flujos de interacción para cada funcionalidad del sistema actual, incluyendo las características implementadas tras la revisión preliminar.

---

## 1. Arquitectura de Información

### 1.1 Rutas del Sistema

| Ruta | Método | Nombre de ruta | Autenticación | Descripción |
|------|--------|----------------|---------------|-------------|
| `/` | GET | `booking.start` | Ninguna (pública) | Página de inicio de reserva. Carga servicios activos, odontólogos activos y slots disponibles. |
| `/reservar` | POST | `booking.store` | Ninguna | Procesa la reserva de cita pública. |
| `/reserva/confirmacion` | GET | `booking.success` | Sesión (flash) | Página de confirmación con resumen de la cita. |
| `/evaluacion/card-sorting` | GET | `evaluations.card-sorting.create` | Ninguna | Formulario de clasificación de tarjetas. |
| `/evaluacion/card-sorting` | POST | `evaluations.card-sorting.store` | Ninguna (rate-limited) | Guarda la clasificación realizada. |
| `/evaluacion/sus` | GET | `evaluations.sus.create` | Ninguna | Formulario del cuestionario SUS. |
| `/evaluacion/sus` | POST | `evaluations.sus.store` | Ninguna (rate-limited) | Guarda las respuestas y calcula la puntuación. |
| `/mis-citas` | GET | `patient.appointments` | Portal privado (token de sesión) | Lista las citas del paciente en la sesión actual. |
| `/mis-citas/{accessToken}` | GET | `patient.appointments.access` | Portal privado (token) | Acceso anónimo a las citas del paciente. |
| `/mis-citas/{appointment}/cancelar` | POST | `patient.appointments.cancel` | Portal privado | Cancela una cita (si está dentro del plazo). |
| `/mis-citas/salir` | POST | `patient.portal.leave` | Portal privado | Revoca el enlace de acceso privado. |
| `/login` | GET | `login` | Ninguna | Formulario de inicio de sesión. |
| `/login` | POST | `login.store` | Ninguna | Procesa el inicio de sesión. |
| `/admin` | GET | `admin.dashboard` | `auth` + `administrator` | Agenda del día con lista de citas y filtros. |
| `/admin/logout` | POST | `admin.logout` | `auth` + `administrator` | Cierra la sesión. |
| `/admin/appointments` | POST | `admin.appointments.store` | `auth` + `administrator` | Crea una cita manualmente. |
| `/admin/appointments/{appointment}/status` | PATCH | `admin.appointments.status` | `auth` + `administrator` | Cambia el estado de una cita. |
| `/admin/patients` | GET | `admin.patients.index` | `auth` + `administrator` | Lista de pacientes con búsqueda y paginación. |
| `/admin/patients` | POST | `admin.patients.store` | `auth` + `administrator` | Registra un nuevo paciente. |
| `/admin/services` | GET | `admin.services.index` | `auth` + `administrator` | Lista de servicios con buscador. |
| `/admin/services` | POST | `admin.services.store` | `auth` + `administrator` | Crea un nuevo servicio. |
| `/admin/services/{service}` | PUT | `admin.services.update` | `auth` + `administrator` | Actualiza un servicio. |
| `/admin/services/{service}` | DELETE | `admin.services.destroy` | `auth` + `administrator` | Elimina un servicio (si no tiene citas). |
| `/admin/schedules` | GET | `admin.schedules.index` | `auth` + `administrator` | Lista de odontólogos con gestión de horarios. |
| `/admin/dentists` | POST | `admin.dentists.store` | `auth` + `administrator` | Registra un nuevo odontólogo. |
| `/admin/dentists/{dentist}` | PUT | `admin.dentists.update` | `auth` + `administrator` | Actualiza un odontólogo. |
| `/admin/dentists/{dentist}/schedules` | PUT | `admin.dentists.schedules.update` | `auth` + `administrator` | Actualiza los horarios semanales de un odontólogo. |
| `/admin/evaluaciones` | GET | `admin.evaluations.index` | `auth` + `administrator` | Panel de resultados de Card Sorting y SUS. |

---

## 2. Flujos de Usuario Detallados

### 2.1 Reserva Pública de Cita (T01–T05)

#### T01 — Agendar una limpieza dental

**Pasos algorítmicos:**

1. El paciente navega a `/`.
2. El `PublicBookingController::create` carga:
   - `services`: servicios activos (`is_active = true`) ordenados por `sort_order`, `name`.
   - `dentists`: odontólogos activos (`is_active = true`) ordenados por `name`.
   - `date`: fecha seleccionada o `now()->addDay()`.
   - `slots`: slots disponibles para el servicio y odontólogo seleccionados (si aplica).
3. El paciente selecciona un servicio en el paso 1:
   - Evento: click en botón del servicio.
   - Acción: `chooseService(service)` guarda `service_id` en el formulario y navega a `/?service_id=X&date=Y&dentist_id=Z`.
4. El paciente selecciona un odontólogo (paso 2):
   - El `<select>` de odontólogos muestra los activos.
   - Evento: change en el select → `chooseDentist(dentistId)` navega con los parámetros actualizados.
5. El paciente selecciona una fecha:
   - El `<input type="date">` tiene `min` = `minimumDate` (24h adelante).
   - Evento: change → `chooseDate(date)` actualiza la URL.
6. Se muestran los slots disponibles:
   - `AppointmentAvailability::slots()` filtra horarios que cumplen: horario del odontólogo, duración + buffer, antelación mínima, sin solapamiento con citas `scheduled` o `confirmed`.
7. El paciente selecciona un slot:
   - Evento: click en botón de horario → `chooseSlot(slot)` guarda `starts_at` y avanza al paso 3.
8. El paciente ingresa sus datos (paso 3):
   - Campos: `name` (obligatorio, texto, max 160), `phone` (obligatorio, texto, max 32), `email` (opcional, email, max 255).
9. El paciente revisa el resumen (paso 4):
   - Se muestra: servicio, odontólogo, fecha, horario, nombre, teléfono.
10. El paciente confirma:
    - Evento: submit del formulario → `submitBooking(event)`.
    - Acción: `form.post('/reservar', ...)`.

**Tipos de datos:**
- `service_id`: integer (exists:services,id, is_active=1, requires_assessment=0)
- `dentist_id`: integer (exists:dentists,id, is_active=1)
- `date`: string (formato Y-m-d)
- `starts_at`: string (formato Y-m-d\TH:i)
- `name`: string (max 160)
- `phone`: string (max 32)
- `email`: string|null (email, max 255)

**Respuesta del servidor (`/reservar`):**
- Si la disponibilidad falla por race condition → `ValidationException` con `starts_at` → redirige de vuelta con error.
- Si todo OK → `to_route('booking.success')` con flash `booking_summary`.

#### T02 — Servicio restringido requiere valoración

1. El paciente selecciona "Restauración simple" (requiere valoración).
2. El botón está `disabled` y muestra "Requiere valoración previa".
3. El paciente hace click en "Reservar valoración primero".
4. Navega a `/?service_id=X` (valoración general).
5. Se cargan slots para la valoración.

**Validación server-side** (`StorePublicAppointmentRequest`):
- `service_id` debe cumplir `requires_assessment = 0`.
- Si falla → error: "El servicio ya no está disponible o requiere una valoración previa."

#### T03 — Fecha sin horarios

1. El paciente navega a `/?date=2026-10-12&service_id=X&dentist_id=Y`.
2. Si el odontólogo no tiene horario para ese día → `slots = []`.
3. Mensaje: "No hay horarios para esta fecha. Prueba otro día de atención."
4. El paciente selecciona otra fecha.

#### T04 — Consultar y cancelar cita

1. Después de reservar, se almacena `booking_patient_id` y `booking_portal_token` en sesión.
2. El paciente navega a `/mis-citas/{token}` o `/mis-citas`.
3. El `PatientPortalController::index` valida el token y carga las próximas citas.
4. El paciente hace click en "Cancelar".
5. Se envía POST a `/mis-citas/{appointment}/cancelar`.
6. `PatientPortalController::cancel` verifica 24h de anticipación.
7. Si OK → cambia estado a `cancelled`, elimina acceso portal, flash `success`.
8. Si dentro de 24h → error flash, mantiene estado `scheduled`.

#### T05 — Cancelación tardía

1. El paciente intenta cancelar una cita con < 24h.
2. `PatientPortalController::cancel` lanza: `'appointment' => 'Debes contactar al consultorio para cancelar con menos de 24 horas de anticipación.'`
3. La cita mantiene estado `scheduled`.

---

### 2.2 Portal Privado del Paciente

#### Flujo de acceso

1. El paciente navega a `/mis-citas`.
2. Si no tiene sesión de reserva → redirige a `booking.start`.
3. Si tiene sesión con `booking_portal_token` → carga `PatientPortalAccess`.
4. El token se valida con `hash_equals()`.
5. Se muestran citas con estado `scheduled` o `confirmed` para la fecha actual y futuras.
6. Estado `cancelled` y `completed`/`no_show` se muestran como histórico.

#### Revocar enlace privado

1. POST `/mis-citas/salir`.
2. Elimina todos los `PatientPortalAccess` del paciente en sesión.
3. Destruye la sesión de reserva.
4. Redirige a `booking.start` con flash `error` (si proceda).

**Tipos de datos:**
- `accessToken`: string (64 caracteres, SHA-256 hash almacenado)
- Token válido para un paciente específico
- Almacenado en `patient_portal_accesses.token_hash`

---

### 2.3 Autenticación del Personal

#### Login

1. Navegación a `/login`.
2. Campos: `email` (obligatorio, email, max 255), `password` (obligatorio, string).
3. Submit → `AuthController::store`.
4. Valida credenciales con `Auth::attempt()`.
5. Si OK:
   - Si es administrador → redirige a `admin.dashboard`.
   - Si no → error, redirige de vuelta.
6. Si falla → error: "Credenciales incorrectas.", `LoginRequest` valida formato.

**Tipos de datos:**
- `email`: string (email, max 255)
- `password`: string (min 8 — definido en `LoginRequest`)

#### Logout

1. POST `/admin/logout`.
2. `AuthController::destroy` llama a `Auth::logout()`.
3. Invalida sesión, regenera token.
4. Redirige a `login`.

---

### 2.4 Gestión de Agenda (Dashboard)

#### Visualizar agenda del día

1. Navegación a `/admin` (o `/admin?date=Y-m-d`).
2. `AppointmentController::index`:
   - Valida `date` (formato Y-m-d).
   - Carga citas para esa fecha con `with('patient:id,name,phone')`.
   - Ordena por `starts_at`.
   - Mapea a array con: id, patient{name,id,phone}, dentist_id, dentist_name, service_name, starts_at (H:i), ends_at (H:i), duration_minutes, status, notes.
3. Carga estadísticas: total, scheduled, confirmed, completed, no_show.
4. Carga `patients` y `dentists` activos para el formulario de nueva cita.

#### Crear cita (manual)

1. Click en "Nueva cita".
2. Formulario modal con:
   - `patient_id`: select (obligatorio, exists:patients,id)
   - `dentist_id`: select (obligatorio, exists:dentists,id, is_active=1)
   - `service_name`: text (obligatorio, max 160)
   - `starts_at`: datetime-local (obligatorio, after:now)
   - `duration_minutes`: select (15,30,45,60,90,120)
   - `notes`: textarea (nullable, max 2000)
3. Submit → `AppointmentController::store`.
4. Usa `withDentistScheduleLock()` para transacción + lock pesimista.
5. Verifica disponibilidad con `isAvailableForDuration()`.
6. Si OK → crea cita, flash `success`, redirige al dashboard con fecha.
7. Si conflicto → error `starts_at`, mantiene formulario.

**Tipos de datos del formulario:**
- `patient_id`: integer (required, exists:patients,id)
- `dentist_id`: integer (required, exists:dentists,id)
- `service_name`: string (required, max 160)
- `starts_at`: string (Y-m-d H:i) (required, date, after:now)
- `duration_minutes`: integer (required, in:15,30,45,60,90,120)
- `notes`: string|null (max 2000)

#### Cambiar estado de cita

1. El admin usa un `<select>` en la fila de la cita.
2. Opciones según estado:
   - `scheduled`: → `confirmed`, `cancelled`, `no_show`
   - `confirmed`: → `completed`, `cancelled`, `no_show`
   - `completed`, `cancelled`, `no_show`: deshabilitado
3. PATCH a `/admin/appointments/{appointment}/status`.
4. `UpdateAppointmentStatusRequest` valida transiciones permitidas.
5. Si la transición es inválida → error `status`.

**Tabla de transiciones:**

| Desde | Posibles destinos |
|-------|------------------|
| scheduled | confirmed, cancelled, no_show |
| confirmed | completed, cancelled, no_show |
| completed | — |
| cancelled | — |
| no_show | — |

---

### 2.5 Gestión de Pacientes

#### Listar pacientes

1. Navegación a `/admin/patients`.
2. `PatientController::index`:
   - Busca por nombre, teléfono o email.
   - Paginación (12 por página).
   - Preserva query string.
3. Muestra nombre, teléfono, email.

#### Agregar paciente

1. Formulario en el dashboard o página de pacientes.
2. Campos:
   - `name`: string (required, max 160)
   - `phone`: string (required, max 32, unique)
   - `email`: string|null (email, max 255, unique)
   - `birth_date`: date|null
3. POST a `/admin/patients`.
4. `StorePatientRequest` valida.
5. Si OK → flash `success`, redirige a lista.

**Tipos de datos:**
- `name`: string (required, max 160)
- `phone`: string (required, max 32)
- `email`: string|null (email, max 255)
- `birth_date`: date|null

---

### 2.6 Gestión de Servicios (CRUD admin)

#### Listar servicios

1. Navegación a `/admin/services`.
2. `ServiceController::index`:
   - Carga todos los servicios ordenados por `sort_order`, `name`.
   - Fields: id, name, slug, description, duration_minutes, buffer_minutes, requires_assessment, is_active, sort_order.
3. Busqueda cliente por nombre o slug.
4. Indicadores visuales:
   - Badge: "Activo" / "Inactivo"
   - Badge: "Requiere valoración" si `requires_assessment`
5. Icons por fila: Edit, Delete.

#### Crear servicio

1. Click "Nuevo servicio".
2. Modal con:
   - `name`: text (required, string, max 160, unique:services,name)
   - `slug`: text (required, string, max 180, unique:services,slug) — auto-generado desde name si está vacío
   - `description`: textarea (required, string, max 2000)
   - `duration_minutes`: select (required, in:15,30,45,60,90,120)
   - `buffer_minutes`: select (required, in:0,15,30,45,60)
   - `requires_assessment`: checkbox (boolean)
   - `is_active`: checkbox (boolean, default true)
   - `sort_order`: number (nullable, integer, min 0)
3. Submit → `form.post('/admin/services')`.
4. `StoreServiceRequest` valida.
5. Si OK → flash `success`, cierra modal, recarga lista.

**Lógica de slug:**
- Si `slug` está vacío y `name` tiene valor → `Str::slug(name)`.
- Si `slug` tiene valor → se usa, pero se le aplica `slugify()` en el cliente.

#### Editar servicio

1. Click en icono Edit de una fila.
2. Se abre el mismo modal con datos pre-llenados.
3. Submit → `form.put('/admin/services/{id}')`.
4. `UpdateServiceRequest` valida (ignora current ID en unique).
5. Si OK → flash `success`, cierra modal.

#### Eliminar servicio

1. Click en icono Delete (Trash2).
2. Confirmación: `window.confirm('¿Eliminar el servicio "X"?')`.
3. Si confirma → `router.delete('/admin/services/{id}')`.
4. `ServiceController::destroy`:
   - Si el servicio tiene citas asociadas → error flash: "No se puede eliminar un servicio con citas registradas. Desactívalo en su lugar."
   - Si no → elimina y flash: "Servicio eliminado de la lista."
5. Redirige a lista de servicios.

---

### 2.7 Gestión de Odontólogos y Horarios

#### Listar odontólogos

1. Navegación a `/admin/schedules`.
2. `ScheduleController::index`:
   - Carga odontólogos con schedules Eager Loaded (orderBy weekday).
   - Fields: id, name, is_active.
3. Muestra una tarjeta por odontólogo con:
   - Nombre
   - Estado (activo/inactivo)
   - Formulario de horarios semanales

#### Agregar odontólogo

1. Click "Agregar odontólogo".
2. Formulario:
   - `name`: text (required, unique:dentists,name)
3. POST a `/admin/dentists`.
4. `StoreDentistRequest` valida.
5. Si OK → flash `success`, cierra formulario.

#### Actualizar odontólogo

1. Formulario en la tarjeta del odontólogo.
2. Campos:
   - `name`: text (required, unique:dentists,name,ignore:id)
   - `is_active`: checkbox
3. PUT a `/admin/dentists/{dentist}`.
4. `UpdateDentistRequest` valida.

#### Actualizar horarios semanales

1. En cada tarjeta de odontólogo, hay un formulario de horarios.
2. 7 filas (lunes a domingo), cada una con:
   - `weekday`: integer (1-7, oculto, readonly)
   - `is_open`: checkbox
   - `opens_at`: time (formato H:i)
   - `closes_at`: time (formato H:i)
3. Si `is_open` está desmarcado → se elimina el schedule.
4. Si `is_open` está marcado → upsert del schedule.
5. PUT a `/admin/dentists/{dentist}/schedules`.
6. `UpdateSchedulesRequest` valida:
   - `schedules`: array de tamaño 7.
   - Cada día: weekday (1-7), is_open (bool), opens_at (H:i), closes_at (H:i).
   - Exactamente 7 días únicos (1-7).
   - closes_at > opens_at si is_open.
7. Transacción con `DB::transaction()`.

**Tipos de datos:**
- `schedules`: array (required, size:7)
- `schedules.*.weekday`: integer (required, between:1,7)
- `schedules.*.is_open`: boolean (required)
- `schedules.*.opens_at`: string (required, date_format:H:i)
- `schedules.*.closes_at`: string (required, date_format:H:i)

---

### 2.8 Herramienta Card Sorting

#### Participar en el estudio

1. El paciente navega a `/evaluacion/card-sorting`.
2. `CardSortingController::create`:
   - Carga `cards` desde `config('usability.card_sorting_cards')` (8 tarjetas).
   - `submitted = false`.
3. El paciente ve 8 tarjetas y dos categorías por defecto.
4. Puede:
   - Arrastrar tarjetas entre categorías (drag-drop HTML5).
   - Usar un `<select>` por tarjeta para asignar (fallback teclado).
   - Agregar más categorías.
   - Renombrar categorías.
5. Al enviar, se reúne cada tarjeta exactamente en una categoría.
6. POST a `/evaluacion/card-sorting` (rate-limited: 10/min).
7. `StoreCardSortingResponseRequest` valida:
   - `groups`: array, min 1.
   - Cada grupo: `name` (required, max 80), `cards` (required, array, min 1).
   - Cada card ID debe estar en el set definido.
   - All 8 cards assigned exactly once (validación custom en `after()`).
8. Guarda en `card_sorting_responses.groups` (JSON) y `submitted_at`.
9. Muestra mensaje: "Gracias. Tu clasificación quedó registrada de forma anónima."

**Tarjetas definidas en `config/usability.php`:**

| ID | Etiqueta |
|----|----------|
| book_appointment | Agendar una cita |
| services | Consultar servicios dentales |
| patient_appointments | Consultar mis citas |
| cancel_appointment | Cancelar una cita |
| clinic_schedule | Consultar horarios de atención |
| staff_agenda | Ver agenda de la clínica |
| patients | Administrar pacientes |
| staff_services | Administrar servicios |

**Tipos de datos:**
- `groups`: array (required, min 1)
- `groups.*.name`: string (required, max 80)
- `groups.*.cards`: array (required, min 1)
- `groups.*.cards.*`: string (required, in defined card IDs)

---

### 2.9 Cuestionario SUS

#### Aplicar SUS

1. El paciente navega a `/evaluacion/sus`.
2. `SusEvaluationController::create`:
   - Carga `questions` desde `config('usability.sus_questions')` (10 preguntas).
   - `submitted = false`, `score = null`.
3. El paciente responde cada pregunta con escala 1-5:
   - 1 = Totalmente en desacuerdo
   - 2 = En desacuerdo
   - 3 = Ni de acuerdo ni en desacuerdo
   - 4 = De acuerdo
   - 5 = Totalmente de acuerdo
4. POST a `/evaluacion/sus` (rate-limited: 10/min).
5. `StoreSusResponseRequest` valida:
   - `answers`: array (required, size 10).
   - Cada respuesta: integer (required, between 1,5).
   - Índices exactos 0-9 (validación custom en `after()`).
6. Cálculo de puntuación SUS:
   - Para preguntas impares (índice 0,2,4,6,8): `respuesta - 1`.
   - Para preguntas pares (índice 1,3,5,7,9): `5 - respuesta`.
   - Suma de los 10 valores × 2.5 = puntuación 0-100.
7. Guarda en `sus_responses.answers` (JSON), `score` (decimal 5,2), `submitted_at`.
8. Muestra: "Tu respuesta quedó registrada. Puntaje calculado: X / 100."

**Preguntas SUS (español adaptado):**

| # | Pregunta |
|---|----------|
| 1 | Me gustaría utilizar esta plataforma con frecuencia. |
| 2 | La plataforma me pareció más complicada de lo necesario. |
| 3 | Considero que la plataforma es fácil de utilizar. |
| 4 | Necesitaría ayuda técnica para utilizar correctamente esta plataforma. |
| 5 | Las funciones de la plataforma me parecieron bien integradas. |
| 6 | Encontré demasiadas diferencias entre las distintas partes de la plataforma. |
| 7 | Creo que la mayoría de las personas aprenderían a utilizarla rápidamente. |
| 8 | Me resultó poco práctica de utilizar. |
| 9 | Me sentí con confianza al utilizar la plataforma. |
| 10 | Tuve que aprender muchas cosas antes de poder comenzar a utilizarla. |

**Tipos de datos:**
- `answers`: array (required, size 10)
- `answers.*`: integer (required, between 1,5)

---

### 2.10 Panel de Resultados de Evaluaciones (Admin)

#### Visualizar resultados

1. Navegación a `/admin/evaluaciones` (requiere `auth` + `administrator`).
2. `EvaluationResultsController::index`:
   - `susSummary`: COUNT y AVG(score) de todas las respuestas.
   - `cardSortingResponses`: 50 respuestas recientes con id, groups, submitted_at.
3. Muestra:
   - Contador de respuestas SUS
   - Promedio SUS (redondeado a 1 decimal)
   - Lista de clasificaciones Card Sorting con nombres de categorías y tarjetas

---

## 3. Modelos y Relaciones

### 3.1 Appointment

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| patient_id | bigint | No | — | FK a Patient |
| dentist_id | bigint | Sí | null | FK a Dentist (para separar horarios) |
| service_id | bigint | Sí | null | FK a Service (null para admin manual) |
| dentist_name | string | No | — | Copia del nombre del dentista |
| service_name | string | No | — | Texto descriptivo |
| starts_at | datetime | No | — | Fecha/hora inicio |
| ends_at | datetime | No | — | Fecha/hora fin |
| duration_minutes | integer | No | — | Duración sin buffer |
| buffer_minutes | integer | No | — | Tiempo de preparación |
| status | string | No | 'scheduled' | Uno de STATUSES |
| notes | string | Sí | null | Notas del admin |

**STATUSES:** `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`

### 3.2 Service

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| name | string(160) | No | — | Nombre descriptivo |
| slug | string(180) | No | — | Slug único para URLs |
| description | string(2000) | No | — | Descripción pública |
| duration_minutes | integer | No | — | Uno de: 15,30,45,60,90,120 |
| buffer_minutes | integer | No | — | Uno de: 0,15,30,45,60 |
| requires_assessment | boolean | No | false | Si requiere valoración previa |
| is_active | boolean | No | true | Disponible para reserva pública |
| sort_order | integer | Sí | 0 | Orden de aparición |

### 3.3 Dentist

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| name | string(160) | No | — | Nombre único |
| is_active | boolean | No | true | Si aparece en reserva pública |

### 3.4 Schedule

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| dentist_id | bigint | No | — | FK a Dentist (cascade on delete) |
| weekday | tinyint | No | — | 1=Lunes ... 7=Domingo |
| opens_at | time | No | — | Hora de apertura |
| closes_at | time | No | — | Hora de cierre |

**Constraint único:** (dentist_id, weekday)

### 3.5 Patient

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| name | string(160) | No | — | Nombre completo |
| phone | string(32) | No | — | Teléfono (único) |
| email | string(255) | Sí | null | Email (único) |
| birth_date | date | Sí | null | Fecha de nacimiento |

### 3.6 PatientPortalAccess

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| patient_id | bigint | No | — | FK a Patient |
| token_hash | string(64) | No | — | SHA-256 del token de acceso |

### 3.7 CardSortingResponse

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| groups | json | No | — | Array de {name, cards} |
| submitted_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de envío |

### 3.8 SusResponse

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| id | bigint | No | — | PK |
| answers | json | No | — | Array de 10 enteros (1-5) |
| score | decimal(5,2) | No | — | Puntuación SUS (0-100) |
| submitted_at | timestamp | No | CURRENT_TIMESTAMP | Fecha de envío |

---

## 4. Reglas de Negocio

| ID | Regla | Implementación |
|----|-------|----------------|
| RB01 | Un horario no puede ser reservado por dos pacientes simultáneamente | `withDentistScheduleLock()` + `lockForUpdate()` + revalidación |
| RB02 | Una cita cancelada libera el horario | `status = 'cancelled'` no se incluye en slots disponibles |
| RB03 | La duración del servicio determina los bloques | `duration_minutes + buffer_minutes` define el slot mínimo |
| RB04 | Anticipación mínima de 24h | `minimum_advance_hours = 24` en `config/clinic.php` |
| RB05 | Cancelación hasta 24h antes | `PatientPortalController::cancel` verifica `$appointment->starts_at > now()->addHours(24)` |
| RB06 | Cancelación tardía: contactar | Mensaje: "Debes contactar al consultorio..." |
| RB07 | Inasistencia registrada como estado | `no_show` en `STATUSES`, terminal (no se puede reabrir) |
| RB08 | Transiciones de estado controladas | `UpdateAppointmentStatusRequest::after()` valida matriz |
| RB09 | Servicios restringidos requieren valoración | `requires_assessment = 0` en validación de reserva + UI deshabilita servicios |
| RB10 | Slot interval = 30 min | `slot_interval_minutes = 30` en `config/clinic.php` |

---

## 5. Configuración del Sistema

### 5.1 `config/clinic.php`

| Clave | Valor | Descripción |
|-------|-------|-------------|
| `minimum_advance_hours` | 24 | Horas mínimas de anticipación para reservar |
| `cancellation_deadline_hours` | 24 | Horas mínimas para cancelar sin contactar |
| `slot_interval_minutes` | 30 | Intervalo entre slots de horario |
| `demo_admin.email` | env DEAFULT_ADMIN_EMAIL | Email de admin demo |
| `demo_admin.password` | env DEAFULT_ADMIN_PASSWORD | Password de admin demo |

### 5.2 `config/usability.php`

| Clave | Contenido |
|-------|-----------|
| `card_sorting_cards` | 8 tarjetas con IDs: book_appointment, services, patient_appointments, cancel_appointment, clinic_schedule, staff_agenda, patients, staff_services |
| `sus_questions` | 10 preguntas SUS en español |

---

## 6. Seguridad

| Aspecto | Implementación |
|---------|---------------|
| Auth | `auth` middleware en rutas admin |
| Authorization | `administrator` middleware verifica `$request->user()->is_admin` |
| Rate limiting | Card Sorting y SUS: 10 requests/min |
| Token portal | SHA-256 hash, `hash_equals()` para comparación |
| CSRF | Automático con Laravel |
| XSS | Inertia/React escapado automáticamente |
| Data leak | No se solicitan ni almacenan datos clínicos |

---

## 7. Accesibilidad (RNF02)

| Criterio | Implementación |
|----------|----------------|
| Contraste | Paleta con suficiente contraste en tema claro/oscuro |
| Tamaño texto | 16px en inputs para evitar zoom en móvil |
| Navegación teclado | Tab orden secuencial, Enter en selects |
| Foco visible | `focus-visible:outline` y `focus-visible:outline-[#416984]` |
| Labels | `aria-label`, `<label>` asociados |
| Mensajes error | `aria-invalid`, `aria-describedby` |
| Color | Estado también expresado con texto (ej: "Activo"/"Inactivo") |
| Role | `role="status"` para success, `role="alert"` para errors |
| Tests | `@axe-core/playwright` con tags wcag2a/2aa/21a/21aa |

---

## 8. Responsive (RNF03)

| Viewport | Consideraciones |
|----------|----------------|
| 1280px (desktop) | Sidebar completo visible, grid de citas en 3-4 columnas |
| 768px (tablet) | Sidebar oculto, modal de cita full-width |
| 375px (mobile) | Layout single-column, inputs full-width |
| 320px (small mobile) | Pasos con nombres accesibles, enlace al portal visible |

**Tests:** Playwright verifica `documentElement.scrollWidth <= viewportWidth` en 320/375/768/1280px para booking, card-sorting y SUS.

---

## 9. Mapeo de Requisitos Funcionales a Implementación

| RF | Descripción | Estado | Archivos clave | Tests |
|----|-------------|--------|-----------------|-------|
| RF001 | Paciente consulta servicios | ✅ | PublicBookingController, Booking/Create.jsx | PublicBookingTest |
| RF002 | Paciente selecciona servicio | ✅ | Booking/Create.jsx | PublicBookingTest |
| RF003 | Paciente selecciona fecha/horario | ✅ | AppointmentAvailability, Booking/Create.jsx | PublicBookingTest |
| RF004 | Login personal | ✅ | AuthController, LoginRequest | AdminAuthorizationTest |
| RF005 | Paciente ingresa datos contacto | ✅ | Booking/Create.jsx paso 3 | PublicBookingTest |
| RF006 | Paciente confirma cita y referencia | ✅ | PublicBookingController::success | PublicBookingTest |
| RF007 | Paciente consulta citas (portal) | ✅ | PatientPortalController | PublicBookingTest |
| RF008 | Paciente cancela cita (plazo) | ✅ | PatientPortalController::cancel | PublicBookingTest |
| RF009 | Paciente revoca enlace privado | ✅ | PatientPortalController::leave | PublicBookingTest |
| RF010 | Admin gestiona agenda del día | ✅ | AppointmentController, Dashboard | AppointmentWorkflowTest |
| RF011 | Admin crea cita manualmente | ✅ | AppointmentController::store | AppointmentWorkflowTest |
| RF012 | Admin cambia estado cita | ✅ | AppointmentController::updateStatus | AppointmentWorkflowTest |
| RF013 | Admin gestiona pacientes | ✅ | PatientController | AppointmentWorkflowTest |
| RF014 | Gestión de horarios | ✅ | ScheduleController, Schedule model | ScheduleManagementTest |
| RF015 | CRUD de servicios | ✅ | ServiceController, Admin/Services | ServiceManagementTest |
| RF016 | No doble reserva simultánea | ✅ | withDentistScheduleLock | AppointmentWorkflowTest |
| RF017 | Cita cancelada libera horario | ✅ | AppointmentAvailability | PublicBookingTest |
| RF018 | Servicios restringidos requieren valoración | ✅ | StorePublicAppointmentRequest | PublicBookingTest |
| RF019 | Admin administra odontólogos | ✅ | ScheduleController | ScheduleManagementTest |
| RF020 | Card Sorting integrado | ✅ | CardSortingController | EvaluationTest |
| RF021 | SUS formulario integrado | ✅ | SusEvaluationController | EvaluationTest |

---

## 10. Tabla de Trazabilidad de Tests

| Test | Archivo | RF/RNF/RB cubierto(s) |
|------|---------|-----------------------|
| test_public_booking_page_lists_services_and_available_slots | PublicBookingTest.php | RF001, RF003 |
| test_public_booking_creates_a_fictional_patient_and_appointment | PublicBookingTest.php | RF005, RF006 |
| test_public_booking_rejects_a_slot_blocked_by_another_appointment | PublicBookingTest.php | RF003, RB01 |
| test_public_booking_requires_an_assessment_for_restricted_services | PublicBookingTest.php | RF018 |
| test_patient_can_consult_and_cancel_their_own_appointment | PublicBookingTest.php | RF007, RF008 |
| test_patient_portal_requires_a_booking_session | PublicBookingTest.php | RF007 |
| test_patient_can_revoke_the_private_portal_link | PublicBookingTest.php | RF009 |
| test_public_booking_does_not_attach_a_known_phone_to_an_existing_patient | PublicBookingTest.php | RF005 |
| test_public_booking_availability_is_separated_by_dentist | PublicBookingTest.php | RF003, RF014 |
| test_patient_cannot_cancel_an_appointment_owned_by_another_session | PublicBookingTest.php | RF008 (seguridad) |
| test_patient_cannot_cancel_within_the_configured_deadline | PublicBookingTest.php | RF008, RB05 |
| test_dashboard_shows_appointments_for_the_selected_day | AppointmentWorkflowTest.php | RF010 |
| test_patient_can_be_added_to_the_clinic_directory | AppointmentWorkflowTest.php | RF013 |
| test_patient_requires_a_name_and_contact_number | AppointmentWorkflowTest.php | RF013, RNF01 |
| test_appointment_is_saved_with_its_end_time | AppointmentWorkflowTest.php | RF011 |
| test_appointment_is_rejected_when_the_dentist_has_an_overlap | AppointmentWorkflowTest.php | RF016, RB01 |
| test_scheduled_appointment_can_be_confirmed | AppointmentWorkflowTest.php | RF012, RB08 |
| test_confirmed_appointment_can_be_marked_as_no_show | AppointmentWorkflowTest.php | RB07 |
| test_no_show_appointment_cannot_be_reopened | AppointmentWorkflowTest.php | RB07, RB08 |
| test_completed_appointment_cannot_be_reopened | AppointmentWorkflowTest.php | RF012, RB08 |
| test_admin_can_view_services_index | ServiceManagementTest.php | RF015 |
| test_guest_is_redirected_from_services_index | ServiceManagementTest.php | RF015 (auth) |
| test_non_admin_is_forbidden_from_services | ServiceManagementTest.php | RF015 (auth) |
| test_admin_can_create_a_service | ServiceManagementTest.php | RF015 |
| test_service_requires_a_unique_name | ServiceManagementTest.php | RF015 (validación) |
| test_service_requires_a_unique_slug | ServiceManagementTest.php | RF015 (validación) |
| test_admin_can_update_a_service | ServiceManagementTest.php | RF015 |
| test_admin_can_delete_a_service_without_appointments | ServiceManagementTest.php | RF015 |
| test_admin_cannot_delete_a_service_with_appointments | ServiceManagementTest.php | RF015 |
| test_slug_is_auto_generated_if_not_provided_on_create | ServiceManagementTest.php | RF015 (UX) |
| test_service_requires_a_name | ServiceManagementTest.php | RF015 (validación) |
| test_service_requires_a_duration | ServiceManagementTest.php | RF015 (validación) |
| test_administrator_can_add_a_dentist_and_set_weekly_hours | ScheduleManagementTest.php | RF014 |
| test_schedule_rejects_a_closing_time_before_opening | ScheduleManagementTest.php | RF014 (validación) |
| test_guest_is_redirected_from_schedule_management | ScheduleManagementTest.php | RF014 (auth) |
| test_schedule_management_page_shows_registered_dentists | ScheduleManagementTest.php | RF014 |
| test_card_sorting_submission_persists_each_card_in_one_group | EvaluationTest.php | RF020 |
| test_card_sorting_rejects_a_card_assigned_more_than_once | EvaluationTest.php | RF020 (validación) |
| test_sus_submission_saves_answers_and_calculates_score | EvaluationTest.php | RF021 |
| test_sus_submission_requires_all_ten_valid_answers | EvaluationTest.php | RF021 (validación) |
| test_only_administrators_can_view_evaluation_results | EvaluationTest.php | RF020, RF021 (auth) |
| booking page has no horizontal overflow at supported widths | accessibility.spec.js | RNF02, RNF03 |
| booking page exposes visible keyboard focus and passes axe WCAG checks | accessibility.spec.js | RNF02, RNF03 |
| SUS questionnaire passes axe WCAG checks | accessibility.spec.js | RNF02 |
| Card Sorting controls pass axe WCAG checks | accessibility.spec.js | RNF02 |
| test_guest_is_redirected_to_login_from_admin_routes | AdminAuthorizationTest.php | RF004 (seguridad) |
| test_authenticated_non_administrator_is_forbidden_from_admin_panel | AdminAuthorizationTest.php | RF004 (seguridad) |
| test_administrator_can_open_panel_after_login | AdminAuthorizationTest.php | RF004 |
| test_non_administrator_cannot_sign_in_to_admin_panel | AdminAuthorizationTest.php | RF004 (seguridad) |
| test_authenticated_administrator_visiting_login_is_redirected_to_panel | AdminAuthorizationTest.php | RF004 |

**Total estimado:** ~55 tests PHPUnit + 4 tests Playwright (e2e) = ~59 tests

---

## 11. Iteraciones de Diseño (I01–I04) con Estado Actualizado

| Iteración | Hallazgo | Solución implementada | Estado |
|-----------|----------|----------------------|--------|
| I01 | Nombres de pasos ocultos en 320px | `text-xs sm:text-xs` con `sr-only` fallback | ✅ Implementado |
| I02 | Inputs < 16px | Todos los inputs usan 16px base (`text-base`) | ✅ Implementado |
| I03 | Enlace "Mis citas" oculto en móvil | Enlace persistente con `aria-label` | ✅ Implementado |
| I04 | Servicio restringido no marcado | `disabled` + mensaje "Requiere valoración previa" + link a valoración | ✅ Implementado |
| I05 | Sin selección de odontólogo | Select de odontólogos activos, slots filtrados | ✅ Implementado |
| I06 | Sin estado de inasistencia | Estado `no_show` con transición desde scheduled/confirmado | ✅ Implementado |
| I07 | Sin herramienta Card Sorting | Drag-drop web integrado con persistencia anónima | ✅ Implementado |
| I08 | Sin formulario SUS | Cuestionario de 10 preguntas con cálculo automático | ✅ Implementado |

---

## 12. Buenas Prácticas Implementadas

1. **Prevención de race conditions:** Lock distribuido + transacción DB + `lockForUpdate()`.
2. **Validación doble:** Client-side (React + Inertia errors) y server-side (FormRequest).
3. **Soft delete protect:** Servicios con citas no pueden eliminarse (se desactiva instead).
4. **Accesibilidad WCAG:** Tags `aria-*`, foco visible, contraste, labels asociados, axe-core en CI.
5. **Responsive automatizado:** scrollWidth verificado en 4 viewports con Playwright.
6. **Rate limiting:** Card Sorting y SUS limitados a 10 req/min por IP.
7. **Transaccionalidad:** Horarios de dentistas actualizados en `DB::transaction()`.
8. **Anonimato:** Card Sorting y SUS no capturan datos personales identificables.
9. **Dark mode persistente:** Estado guardado en `localStorage` via `ThemeToggle`.
10. **SEO/ARIA:** `Head` de Inertia, etiquetas semánticas, `nav[aria-label]`.
