# Trazabilidad de Requisitos — Doc. Final UID vs. Sistema `citas-dentales`

> **Documento de trazabilidad** generado a partir de la comparación entre
> el formato requerido por `Doc. Final UID.docx` (entrega final del curso
> de Interacción y Usabilidad de Interfaces de Usuario) y el estado actual
> del sistema web `citas-dentales`.
>
> **Metodología de análisis:** revisión estática del código fuente
> (`routes/web.php`, controladores, modelos, migraciones, requests,
> componentes React/Inertia, tests PHPUnit) y del documento de diseño
> `docs/Diseño e implementación de un sistema web para la programación de citas dentales centrado en la experiencia del paciente.md`.
>
> **Leyenda de estado:**
> - `IMPLEMENTADO` — la funcionalidad existe y está cubierta por tests.
> - `PARCIAL` — existe parte de la funcionalidad; falta algo.
> - `FALTANTE` — no existe en el sistema; se debe implementar.
> - `PENDIENTE EVALUACIÓN` — no se puede verificar con el código actual; requiere intervención con usuarios o herramientas externas.

---

## 1. Introducción

### 1.1 Definición del problema (social y computacional)

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Problema social | IMPLEMENTADO | Documentado en `docs/...md` párrafo introductorio: la programación de citas requiere elegir servicio, fecha, horario y datos de contacto; si no se presenta con claridad, el paciente puede equivocarse o necesitar asistencia. | La descripción social está en el documento de diseño. |
| Problema computacional | IMPLEMENTADO | El sistema abstrae la agenda mediante `AppointmentAvailability` (`app/Services/AppointmentAvailability.php:13`) y bloquea horarios ocupados. | La lógica de disponibilidad está implementada. |

### 1.2 Justificación

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Justificación del proyecto | IMPLEMENTADO | Documentada en `docs/...md` §1.3: permite estudiar efectividad, eficiencia y satisfacción en un contexto de uso concreto. | Presente. |

### 1.3 Objetivos

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Objetivo general | IMPLEMENTADO | `app/Services/AppointmentAvailability.php` + flujo de reserva implementan el objetivo de programar y gestionar citas centrado en la experiencia del paciente. | Verificado en código. |
| OE1: Identificar requerimientos | IMPLEMENTADO | `docs/...md` §2.3 Reglas del dominio; migraciones y config `clinic.php` definen duración, horarios, disponibilidad, cancelaciones, anticipación mínima. | Documentado y parcialmente implementado. |
| OE2: Arquitectura de información y flujos | IMPLEMENTADO | `routes/web.php:10-17` define las rutas de reserva (`booking.start`, `booking.store`, `booking.success`) y portal (`patient.appointments`, `patient.appointments.cancel`). | Arquitectura de rutas implementada. |
| OE3: Interfaz consistente | IMPLEMENTADO | Componentes compartidos (`ThemeToggle.jsx`, `DentalMark.jsx`), estilos consistentes en `app.css`, modo claro/oscuro persistente. | Verificado en vistas. |
| OE4: Prevención y recuperación de errores | IMPLEMENTADO | `StorePublicAppointmentRequest` valida disponibilidad y `AppointmentAvailability::withDentistScheduleLock()` serializa las reservas mediante el lock compartido de base de datos, una transacción y revalidación antes de crear la cita. | La ejecución de pruebas concurrentes queda pendiente en el entorno PHP 8.5 del proyecto. |
| OE5: Gestión de servicios, horarios, pacientes, citas | IMPLEMENTADO | Citas y pacientes (`AppointmentController`, `PatientController`), CRUD de servicios (`ServiceController`) y horarios/odontólogos (`ScheduleController`, `Schedule`, `Dentist`). | Los horarios se administran por odontólogo y ya no dependen de `config/clinic.php`. |
| OE6: Criterios básicos de accesibilidad | IMPLEMENTADO (PARCIAL) | Semántica y foco de teclado existentes; axe-core automatizado para reserva, Card Sorting y SUS, además de contraste WCAG y foco visible. | El análisis automatizado no sustituye pruebas con lector de pantalla ni evaluación humana. |
| OE7: Evaluación heurística y tareas con participantes | IMPLEMENTADO (PARCIAL) | El sistema ahora incluye Card Sorting abierto y cuestionario SUS anónimos con persistencia y resumen administrativo. | La participación real, la evaluación heurística externa y las sesiones registradas siguen pendientes. |
| OE8: Análisis y mejoras iterativas | IMPLEMENTADO (PARCIAL) | Iteraciones I01-I04 documentadas en `docs/...md` §10. | Implementado parcialmente. |

---

## 2. Metodología

### 2.1 Perfil de usuarios

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Perfil paciente | IMPLEMENTADO | Flujo público (`Booking/Create.jsx`, `Booking/Success.jsx`, `Booking/Appointments.jsx`). | Implementado. |
| Perfil personal | IMPLEMENTADO | Panel admin (`Dashboard.jsx`, `Patients/Index.jsx`, `Auth/Login.jsx`). | Implementado. |
| Recolección de perfiles reales | FALTANTE | Los perfiles son de diseño, no de entrevistas. `docs/...md` §1.3.4 estatalo. | Pendiente entrevista con consultorio. |

### 2.2 Pruebas — CardSorting

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Diseño CardSorting | IMPLEMENTADO | Interfaz propia de clasificación con arrastrar/soltar, alternativa accesible por selectores y persistencia anónima. | `Evaluations/CardSorting.jsx`, `CardSortingController` y `card_sorting_responses`. |
| Tipo de CardSorting | IMPLEMENTADO | Clasificación abierta: los participantes crean y nombran sus propias categorías. | No depende de OptimalWorkshop/UXWeak. |
| Análisis de participantes | FALTANTE | No hay datos de participantes. | Pendiente. |
| Tarjetas / Categorías / Subcategorías | IMPLEMENTADO (PARCIAL) | Ocho tarjetas configuradas y categorías abiertas creadas por el participante. | No se implementó jerarquía de subcategorías. |
| Pre-test / Post-test | FALTANTE | El sistema integra Card Sorting y SUS, pero no cuestionarios diferenciados pre-test y post-test. | Pendiente de definir con el protocolo de evaluación. |
| Tabla de estandarización | FALTANTE | No existe. | Pendiente. |
| Matriz de similitud | FALTANTE | No existe. | Pendiente. |
| Análisis de Componentes Principales (PCA) | FALTANTE | No existe. | Pendiente. |

### 2.3 Pruebas — Evaluación Heurística

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Descripción de la evaluación | IMPLEMENTADO | `docs/...md` §9.1 contiene tabla de 10 heurísticas (Nielsen). | Documentada. |
| Resultados con tabla | IMPLEMENTADO (PARCIAL) | Tabla de inspección con severidades 0-4. Pero: "no es una evaluación independiente ni una prueba con pacientes". | Falta validación con usuarios. |
| Pantalla con cambios más relevantes | IMPLEMENTADO (PARCIAL) | Iteraciones I01-I04 documentadas. | Falta validación con usuarios. |

---

## 3. Proyecto (Descripción)

### 3.1 Caso de estudio

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Caso de estudio | IMPLEMENTADO | Consultorio dental particular. `docs/...md` §1.1. | Documentado. |

### 3.2 Producto

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Tipo de producto | IMPLEMENTADO | Aplicación web responsive para pacientes y personal. | `composer.json`, `resources/js/`, `routes/web.php`. |

### 3.3 Tecnologías

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Frontend | IMPLEMENTADO | React con Inertia. `package.json` (`@inertiajs/react`, `react`). | Verificado. |
| Backend | IMPLEMENTADO | Laravel 13. `composer.json` (`laravel/framework: ^13.17`). | Verificado. |
| Base de datos | IMPLEMENTADO (PARCIAL) | MySQL previsto (`.env.example` comenta `# DB_DATABASE=citas_dentales`); pero `DB_CONNECTION=sqlite` por defecto. | Configuración dual disponible. |
| Prototipado | FALTANTE | Figma mencionado en `docs/...md` §1.2 como "Prototipado: Figma", pero no hay archivos Figma en el repositorio. | Pendiente vincular. |

### 3.4 Problema

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Problema planteado | IMPLEMENTADO | `docs/...md` §4.3 describe que programar una cita requiere elegir servicio, fecha, horario y datos; si no es claro, errores y asistencia. | Documentado. |

### 3.5 Pregunta de investigación

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Pregunta de investigación | IMPLEMENTADO | `docs/...md` §4.4: "¿Cómo diseñar una interfaz web que facilite a los pacientes la búsqueda y programación de citas dentales de manera clara, eficiente y accesible?" | Documentada. |

---

## 4. Análisis

### 4.1 Requerimientos Funcionales

A continuación se listan los **RF identificados** del documento y su estado en el sistema. El sistema no numeración formal de RF001-RFxxx; se mapean a partir del código.

| ID | Requerimiento | Estado | Implementación en sistema | Archivos / ubicación |
|----|--------------|--------|--------------------------|----------------------|
| RF001 | El paciente puede consultar servicios disponibles | IMPLEMENTADO | `PublicBookingController::create()` carga servicios activos. | `routes/web.php:10`, `app/Http/Controllers/PublicBookingController.php:27-31`, `resources/js/Pages/Booking/Create.jsx:106-129` |
| RF002 | El paciente selecciona un servicio | IMPLEMENTADO | `chooseService()` en `Create.jsx:32-37`; validación `StorePublicAppointmentRequest`. | `resources/js/Pages/Booking/Create.jsx:32` |
| RF003 | El paciente selecciona odontólogo, fecha y horario disponible | IMPLEMENTADO | La disponibilidad se filtra por odontólogo y horario semanal; `StorePublicAppointmentRequest` valida que el slot siga libre. | `app/Services/AppointmentAvailability.php`, `app/Http/Requests/StorePublicAppointmentRequest.php`, `resources/js/Pages/Booking/Create.jsx` |
| RF004 | Inicio de sesión del personal | IMPLEMENTADO | `AuthController`, `LoginRequest`, `Login.jsx`, ruta `/login`. | `routes/web.php:19-20`, `app/Http/Controllers/AuthController.php`, `app/Http/Requests/LoginRequest.php` |
| RF005 | El paciente ingresa sus datos de contacto | IMPLEMENTADO | Formulario paso 3 en `Create.jsx`; validación `name`, `phone`, `email`. | `resources/js/Pages/Booking/Create.jsx:158-178`, `app/Http/Requests/StorePublicAppointmentRequest.php:34-36` |
| RF006 | El paciente confirma la cita y recibe referencia | IMPLEMENTADO | `PublicBookingController::store()` crea cita y genera referencia `CDT-XXXXXX`. | `app/Http/Controllers/PublicBookingController.php:86-106` |
| RF007 | El paciente consulta sus citas (portal privado) | IMPLEMENTADO | `PatientPortalController::index()` con token privado. | `routes/web.php:13-14`, `app/Http/Controllers/PatientPortalController.php:16-65` |
| RF008 | El paciente cancela su cita (con límite) | IMPLEMENTADO | `PatientPortalController::cancel()` con verificación de 24h. | `routes/web.php:15-16`, `app/Http/Controllers/PatientPortalController.php:67-87` |
| RF009 | El paciente revoca el enlace privado | IMPLEMENTADO | `PatientPortalController::leave()`. | `routes/web.php:17`, `app/Http/Controllers/PatientPortalController.php:89-105` |
| RF010 | El admin gestiona la agenda del día | IMPLEMENTADO | `AppointmentController::index()` con filtro por fecha. | `routes/web.php:24`, `app/Http/Controllers/AppointmentController.php:17-51` |
| RF011 | El admin crea una cita manualmente | IMPLEMENTADO | `AppointmentController::store()` + modal en `Dashboard.jsx`. | `routes/web.php:25`, `app/Http/Controllers/AppointmentController.php:53-67` |
| RF012 | El admin cambia el estado de una cita | IMPLEMENTADO | `AppointmentController::updateStatus()` + validación de transiciones. | `routes/web.php:26-27`, `app/Http/Requests/UpdateAppointmentStatusRequest.php` |
| RF013 | El admin gestiona pacientes | IMPLEMENTADO | `PatientController::index()` (listado con búsqueda/paginación) y `PatientController::store()`. | `routes/web.php:29-30`, `app/Http/Controllers/PatientController.php` |
| RF014 | Gestión de horarios de atención | IMPLEMENTADO | CRUD de odontólogos y horarios semanales por día, con validación de intervalos y una interfaz administrativa. | `app/Models/Schedule.php`, `app/Models/Dentist.php`, `app/Http/Controllers/ScheduleController.php`, `resources/js/Pages/Admin/Schedules/Index.jsx` |
| RF015 | Gestión de servicios (CRUD admin) | IMPLEMENTADO | `ServiceController` (`index`, `store`, `update`, `destroy`), rutas en `routes/web.php:33-36`, validaciones en `StoreServiceRequest`/`UpdateServiceRequest`, UI en `Admin/Services/Index.jsx`. Elimina (soft) servicios con citas asociadas; verificado por `ServiceManagementTest`. | `routes/web.php:33-36`, `app/Http/Controllers/ServiceController.php`, `app/Http/Requests/StoreServiceRequest.php`, `app/Http/Requests/UpdateServiceRequest.php`, `resources/js/Pages/Admin/Services/Index.jsx`, `tests/Feature/ServiceManagementTest.php` |
| RF016 | Un horario no puede ser reservado por dos pacientes | IMPLEMENTADO | Lock compartido por odontólogo/día usando `cache_locks`, transacción, bloqueo pesimista y revalidación de disponibilidad antes de insertar. La creación manual del administrador usa el mismo lock. | `app/Services/AppointmentAvailability.php`, `app/Http/Controllers/PublicBookingController.php`, `app/Http/Controllers/AppointmentController.php` |
| RF017 | Una cita cancelada libera el horario | IMPLEMENTADO | `PatientPortalController::cancel()` cambia estado a `cancelled`; los slots se recalculan excluyendo citas `cancelled`. | `app/Services/AppointmentAvailability.php:26-27` (filtra `scheduled` y `confirmed`) |
| RF018 | Servicios restringidos requieren valoración previa | IMPLEMENTADO | `StorePublicAppointmentRequest` valida `requires_assessment = 0`; `Create.jsx` deshabilita y sugiere valoración. | `app/Http/Requests/StorePublicAppointmentRequest.php:31`, `resources/js/Pages/Booking/Create.jsx:34-36`, `app/Http/Controllers/PublicBookingController.php:34-36` |
| RF019 | El personal administra odontólogos y sus horarios | IMPLEMENTADO | Alta y actualización/activación de dentistas y gestión semanal de horarios desde el panel protegido. | `app/Http/Controllers/ScheduleController.php`, `routes/web.php`, `resources/js/Pages/Admin/Schedules/Index.jsx` |

### 4.2 Requerimientos No Funcionales

| ID | Requisito | Estado | Implementación | Observaciones |
|----|-----------|--------|-----------------|---------------|
| RNF01 | Usabilidad: flujo principal sin asistencia | IMPLEMENTADO | Flujo de 4 pasos en `Create.jsx`; resumen antes de enviar. | Verificado en `docs/...md` §9.3. |
| RNF02 | Accesibilidad: contraste, tamaño texto, teclado, foco, labels, errores, color | IMPLEMENTADO (PARCIAL) | axe-core en CI para reserva, Card Sorting y SUS; verifica reglas WCAG 2.0/2.1 A/AA en tema claro/oscuro, labels y foco visible. | La auditoría de contraste automatizada no reemplaza una evaluación humana o con lector de pantalla. |
| RNF03 | Responsive: escritorio, tablet, móvil | IMPLEMENTADO | Playwright comprueba `documentElement.scrollWidth` y `body.scrollWidth` a 320, 375, 768 y 1280 px para reserva, Card Sorting y SUS. | Falta comprobar dispositivos físicos y las vistas administrativas con sesión autenticada. |
| RNF04 | Consistencia de componentes y patrones | IMPLEMENTADO | Componentes compartidos, misma paleta de colores, modo claro/oscuro persistente. | — |
| RNF05 | Retroalimentación: "Guardando..." → "✓ Confirmada" / "✕ Error" | IMPLEMENTADO | `form.processing` muestra "Enviando…", flash `success`/`error`, estados de cita. | `app/Http/Middleware/HandleInertiaRequests.php:40-43` |

### 4.3 Reglas de negocio

| ID | Regla | Estado | Implementación |
|----|-------|--------|-----------------|
| RB01 | Un horario no puede ser reservado por dos pacientes simultáneamente | IMPLEMENTADO | Lock compartido por odontólogo/día, transacción, `lockForUpdate()` y verificación de solapamientos justo antes de guardar. |
| RB02 | Una cita cancelada libera el horario | IMPLEMENTADO | `Appointment::STATUSES`, filtro en `slots()` excluye `cancelled`. |
| RB03 | La duración del servicio determina los bloques de disponibilidad | IMPLEMENTADO | `AppointmentAvailability::slots()` usa `duration_minutes + buffer_minutes`. |
| RB04 | Anticipación mínima de 24h para reservar | IMPLEMENTADO | `config(clinic.minimum_advance_hours)` = 24; `AppointmentAvailability::slots()` filtra `now()->addHours(24)`. |
| RB05 | Cancelación permitida hasta 24h antes | IMPLEMENTADO | `PatientPortalController::cancel()` verifica `$appointment->starts_at > now()->addHours(24)`. |
| RB06 | Cancelación tardía: contactar al consultorio | IMPLEMENTADO | Mensaje de error en `PatientPortalController::cancel()`. |
| RB07 | Inasistencia: registrada como estado de cita | IMPLEMENTADO | Estado `no_show`, opción administrativa y transiciones desde citas programadas/confirmadas. |
| RB08 | Transiciones de estado: scheduled→confirmed→completed; cancelable desde scheduled/confirmed | IMPLEMENTADO | `UpdateAppointmentStatusRequest::after()` define también `no_show` como estado terminal. |

### 4.4 Escenarios / Casos de uso (identificados por tarea)

| ID Tarea | Consigna | Estado en sistema | Cobertura de tests |
|----------|----------|-------------------|--------------------|
| T01 | Agendar limpieza dental martes 10:30 | IMPLEMENTADO | `PublicBookingTest::test_public_booking_creates_a_fictional_patient_and_appointment` |
| T02 | Restauración simple requiere valoración | IMPLEMENTADO | `PublicBookingTest::test_public_booking_requires_an_assessment_for_restricted_services` |
| T03 | Seleccionar fecha sin horarios y cambiar | IMPLEMENTADO | `PublicBookingTest::test_public_booking_page_lists_services_and_available_slots` |
| T04 | Consultar y cancelar cita recién creada | IMPLEMENTADO | `PublicBookingTest::test_patient_can_consult_and_cancel_their_own_appointment` |
| T05 | Cancelar cita con <24h | IMPLEMENTADO | `PublicBookingTest::test_patient_cannot_cancel_within_the_configured_deadline` |
| T06 | Personal inicia sesión, encuentra cita, confirma estado | IMPLEMENTADO | `AppointmentWorkflowTest::test_scheduled_appointment_can_be_confirmed`, `AdminAuthorizationTest::test_administrator_can_open_panel_after_login` |

---

## 5. Diseño

### 5.1 Interfaz del Usuario

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Tipo de interfaz | IMPLEMENTADO | GUI web responsive (React + Inertia + Tailwind CSS). | Justificado en `docs/...md` §4.2. |
| Justificación elección | IMPLEMENTADO | Documentada en `docs/...md`. | — |

### 5.2 Wireframes

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Wireframe bajo nivel (web) | FALTANTE | No hay archivos Figma en el repositorio. | `docs/...md` §1.2 menciona "Prototipado: Figma" pero no se incluyen assets. **Falta agregar.** |
| Wireframe bajo nivel (móvil) | FALTANTE | No hay mocks móviles. | **Falta agregar.** |
| Capturas con grid | FALTANTE | No hay capturas. | **Falta agregar.** |

### 5.3 Desarrollo

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Descripción general del desarrollo | IMPLEMENTADO (PARCIAL) | `docs/...md` §11 describe arquitectura React+Inertia → Laravel → MySQL. | Documentado pero incompleto (faltan diagramas ER, detalle de componentes). |
| Arquitectura técnica | IMPLEMENTADO | React + Inertia + Laravel + MySQL/SQLite. | Verificado en `composer.json`, `package.json`, `routes/web.php`. |

### 5.4 Diseño Final basado en resultados de evaluación

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Resultados de evaluación | FALTANTE | No hay datos reales de evaluación. | `docs/...md` §13: "no se han realizado sesiones con participantes". |
| Diseño final (web) | IMPLEMENTADO (PARCIAL) | UI funcional con tema claro/oscuro. | No hay comparativa antes/después. |
| Diseño final (móvil) | IMPLEMENTADO (PARCIAL) | Responsive con Tailwind y verificaciones Playwright en anchos 320/375/768/1280 para flujos públicos. | No validado en dispositivo real; falta revisar paneles administrativos con sesión autenticada. |
| Capturas antes/después | FALTANTE | No hay capturas. | **Falta agregar.** |

---

## 6. Evaluación CardSorting

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Descripción de la prueba | IMPLEMENTADO | Herramienta web anónima de Card Sorting abierto, con categorías nombradas por participantes. | Falta aplicar y describir la sesión real. |
| Tipo de CardSorting | IMPLEMENTADO | Abierto, con organización de tarjetas en categorías creadas por el participante. | La elección del tipo se debe justificar en el informe académico. |
| Resultados con participantes | FALTANTE | No hay datos. | **Falta recolectar.** |
| Tabla de estandarización | FALTANTE | No existe. | **Falta crear.** |
| Matriz de similitud | FALTANTE | No existe. | **Falta crear.** |
| PCA | FALTANTE | No existe. | **Falta realizar.** |

---

## 7. Evaluación Heurística

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Descripción de la prueba | IMPLEMENTADO | `docs/...md` §9.1: 10 heurísticas de Nielsen con tabla de inspección. | Documentada internamente (11 oct 2026). |
| Resultados | IMPLEMENTADO (PARCIAL) | Tabla de inspección con 10 hallazgos. | No es evaluación con usuarios. |
| Pantalla con cambios relevantes | IMPLEMENTADO (PARCIAL) | Iteraciones I01-I04 documentadas en `docs/...md` §10. | No hay imágenes before/after. |
| SUS (cuestionario) | IMPLEMENTADO (PENDIENTE DE APLICACIÓN) | Formulario anónimo de 10 preguntas, persistencia y cálculo de puntaje SUS 0–100 con redacción adaptada al prototipo. | Falta validar la redacción frente a una versión española validada antes de recolectar respuestas reales. |

---

## 8. Conclusiones y Trabajos futuros

| Ítem | Estado | Sistema | Observaciones |
|------|--------|---------|---------------|
| Conclusiones | FALTANTE | No documentado. | **Falta redactar.** |
| Trabajos futuros | IMPLEMENTADO (PARCIAL) | `docs/...md` §13 menciona pendientes. | **Falta completar.** |

---

## 9. Referencias

| Ítem | Estado | Observaciones |
|------|--------|---------------|
| Referencias en APA | FALTANTE | `docs/...md` §15 menciona Nielsen, principios de usabilidad, accesibilidad, SUS, docs técnicas. | **Falta redactar en formato APA.** |

---

## 10. Anexos

| Ítem | Estado | Observaciones |
|------|--------|---------------|
| Cuestionario SUS | IMPLEMENTADO EN LA APLICACIÓN | Disponible en `/evaluacion/sus`, con respuestas anónimas. | Falta agregar al informe los resultados reales y su análisis. |
| Tareas de prueba | FALTANTE | **Falta agregar.** |
| Tablas completas | IMPLEMENTADO (PARCIAL) | En `docs/...md`. |
| Wireframes | FALTANTE | **Falta agregar.** |
| Capturas | FALTANTE | **Falta agregar.** |
| Diagramas | FALTANTE | No hay diagramas ER en el repositorio. **Falta agregar.** |
| Resultados | FALTANTE | No hay datos de participantes. |
| Video (.mp4) | FALTANTE | **Falta grabar.** |
| PDF de diseño final (web y móvil) | FALTANTE | **Falta generar.** |
| Enlace a prototipo alto nivel | FALTANTE | **Falta vincular Figma.** |
| Documento de evaluación heurística completa | IMPLEMENTADO (PARCIAL) | Parcialmente en `docs/...md` §9.1 y §10. |

---

## 11. Resumen de funcionalidades faltantes (gaps de implementación)

A continuación se listan todas las funcionalidades que **no existen** o están **parcialmente implementadas** en el sistema actual y que son necesarias para cumplir con los requisitos de `Doc. Final UID.docx`:

### Backend — Funcionalidades faltantes

| # | Funcionalidad | Descripción | Prioridad | Archivos afectados |
|---|--------------|-------------|-----------|---------------------|
| 1 | **CRUD de servicios (admin)** | Rutas y controlador para crear, listar, editar, activar/desactivar y eliminar servicios. | Alta | Implementado: `routes/web.php:33-36`, `app/Http/Controllers/ServiceController.php`, `app/Http/Requests/StoreServiceRequest.php`, `app/Http/Requests/UpdateServiceRequest.php`, `resources/js/Pages/Admin/Services/Index.jsx`, `tests/Feature/ServiceManagementTest.php` |
| 2 | **Gestión de horarios (admin)** | IMPLEMENTADO: modelo `Schedule`, migración, controlador y UI para administrar días/horas por odontólogo. | Alta | `app/Models/Schedule.php`, `app/Http/Controllers/ScheduleController.php`, `resources/js/Pages/Admin/Schedules/Index.jsx` |
| 3 | **Estado "no-show" (ausencia)** | IMPLEMENTADO: estado `no_show`, transición administrativa y estado terminal. | Media | `app/Models/Appointment.php`, `app/Http/Requests/UpdateAppointmentStatusRequest.php`, `resources/js/Pages/Dashboard.jsx` |
| 4 | **Bloqueo transaccional de reservas simultáneas** | IMPLEMENTADO: lock compartido en `cache_locks`, transacción, bloqueos pesimistas y revalidación para reserva pública y alta manual. | Alta | `app/Services/AppointmentAvailability.php`, `app/Http/Controllers/PublicBookingController.php`, `app/Http/Controllers/AppointmentController.php` |
| 5 | **Gestión de dentistas** | IMPLEMENTADO: alta, edición/activación, horarios y selección de odontólogo en reserva pública. | Media | `app/Models/Dentist.php`, migraciones, `app/Http/Controllers/ScheduleController.php` |

### Frontend — Funcionalidades faltantes

| # | Funcionalidad | Descripción | Prioridad | Archivos afectados |
|---|--------------|-------------|-----------|---------------------|
| 6 | **Wireframes Figma** | Mockups de bajo nivel para web y móvil de todas las pantallas. | Alta | Externo (Figma) — vincular en docs |
| 7 | **Capturas de pantalla** | Imágenes de UI actual para incluir en documentación. | Media | Externo — capturar y archivar |
| 8 | **Diagrama ER** | Diagrama entidad-relación de la base de datos. | Alta | Documento `.md` o `.drawio` |
| 9 | **Video demo (.mp4)** | Grabación del funcionamiento de la interfaz. | Media | Externo — grabar y archivar |
| 10 | **PDF de diseño final web+móvil** | Diseño a alto nivel. | Media | Externo — exportar de Figma |

### Metodología de evaluación — Funcionalidades faltantes

| # | Funcionalidad | Descripción | Prioridad |
|---|--------------|-------------|-----------|
| 11 | **CardSorting** | IMPLEMENTADO: herramienta abierta con persistencia. Sigue pendiente aplicarla con participantes y analizar resultados (estandarización, similitud, PCA). | Alta |
| 12 | **Cuestionario SUS** | IMPLEMENTADO: formulario anónimo de 10 preguntas y cálculo de puntuación. Sigue pendiente aplicarlo con participantes. | Alta |
| 13 | **Tests de tareas con participantes** | FALTANTE: no se registra tiempo, errores, ayudas ni éxito de tareas. | Alta |
| 14 | **Auditoría de accesibilidad formal** | IMPLEMENTADO (PARCIAL): axe-core en CI para páginas públicas, contraste WCAG y foco. Sigue pendiente evaluación humana y lector de pantalla. | Alta |
| 15 | **Pruebas responsive automatizadas** | IMPLEMENTADO: Playwright mide `scrollWidth` en 320/375/768/1280px para reserva, Card Sorting y SUS. | Media |
| 16 | **PCA (Análisis de Componentes Principales)** | Análisis estadístico de resultados CardSorting. | Media |

### Documentación — Funcionalidades faltantes

| # | Funcionalidad | Descripción | Prioridad |
|---|--------------|-------------|-----------|
| 17 | **Tabla de estandarización** | Para CardSorting. | Alta |
| 18 | **Matriz de similitud** | Para CardSorting. | Alta |
| 19 | **Referencias en formato APA** | Listado completo. | Media |
| 20 | **Conclusiones finales** | Basadas en datos reales. | Alta |
| 21 | **Trabajos futuros** | Planificación de mejoras. | Media |

---

## 12. Trazabilidad de tests existentes

A continuación se mapean los tests PHPUnit existentes contra los requisitos funcionales:

| Test | Archivo | RF cubierto(s) |
|------|---------|-----------------|
| `test_public_booking_page_lists_services_and_available_slots` | `tests/Feature/PublicBookingTest.php:17` | RF001, RF003 |
| `test_public_booking_creates_a_fictional_patient_and_appointment` | `tests/Feature/PublicBookingTest.php:30` | RF005, RF006 |
| `test_public_booking_rejects_a_slot_blocked_by_another_appointment` | `tests/Feature/PublicBookingTest.php:62` | RF003, RB01 |
| `test_public_booking_requires_an_assessment_for_restricted_services` | `tests/Feature/PublicBookingTest.php:84` | RF018 |
| `test_patient_can_consult_and_cancel_their_own_appointment` | `tests/Feature/PublicBookingTest.php:108` | RF007, RF008 |
| `test_patient_portal_requires_a_booking_session` | `tests/Feature/PublicBookingTest.php:154` | RF007 |
| `test_patient_can_revoke_the_private_portal_link` | `tests/Feature/PublicBookingTest.php:159` | RF009 |
| `test_public_booking_does_not_attach_a_known_phone_to_an_existing_patient` | `tests/Feature/PublicBookingTest.php:182` | RF005 |
| `test_patient_cannot_cancel_an_appointment_owned_by_another_session` | `tests/Feature/PublicBookingTest.php:213` | RF008, seguridad |
| `test_patient_cannot_cancel_within_the_configured_deadline` | `tests/Feature/PublicBookingTest.php:234` | RF008, RB05 |
| `test_dashboard_shows_appointments_for_the_selected_day` | `tests/Feature/AppointmentWorkflowTest.php:17` | RF010 |
| `test_patient_can_be_added_to_the_clinic_directory` | `tests/Feature/AppointmentWorkflowTest.php:36` | RF013 |
| `test_patient_requires_a_name_and_contact_number` | `tests/Feature/AppointmentWorkflowTest.php:52` | RF013, RNF01 |
| `test_appointment_is_saved_with_its_end_time` | `tests/Feature/AppointmentWorkflowTest.php:64` | RF011 |
| `test_appointment_is_rejected_when_the_dentist_has_an_overlap` | `tests/Feature/AppointmentWorkflowTest.php:87` | RF016, RB01 |
| `test_scheduled_appointment_can_be_confirmed` | `tests/Feature/AppointmentWorkflowTest.php:110` | RF012, RB08 |
| `test_completed_appointment_cannot_be_reopened` | `tests/Feature/AppointmentWorkflowTest.php:126` | RF012, RB08 |
| `test_confirmed_appointment_can_be_marked_as_no_show` | `tests/Feature/AppointmentWorkflowTest.php` | RB07, RB08 |
| `test_public_booking_availability_is_separated_by_dentist` | `tests/Feature/PublicBookingTest.php` | RF003, RF014 |
| `test_administrator_can_add_a_dentist_and_set_weekly_hours` | `tests/Feature/ScheduleManagementTest.php` | RF014 |
| Card Sorting and SUS submission tests | `tests/Feature/EvaluationTest.php` | Evaluations |
| Responsive `scrollWidth` and axe WCAG checks | `tests/e2e/accessibility.spec.js` | RNF02, RNF03 |
| `test_guest_is_redirected_to_login_from_admin_routes` | `tests/Feature/AdminAuthorizationTest.php:14` | RF004 (seguridad) |
| `test_authenticated_non_administrator_is_forbidden_from_admin_panel` | `tests/Feature/AdminAuthorizationTest.php:20` | RF004 (seguridad) |
| `test_administrator_can_open_panel_after_login` | `tests/Feature/AdminAuthorizationTest.php:27` | RF004 |
| `test_non_administrator_cannot_sign_in_to_admin_panel` | `tests/Feature/AdminAuthorizationTest.php:42` | RF004 (seguridad) |
| `test_authenticated_administrator_visiting_login_is_redirected_to_panel` | `tests/Feature/AdminAuthorizationTest.php:54` | RF004 |

**Estado de verificación de esta implementación:** pruebas PHPUnit y Playwright añadidas/actualizadas, pero pendientes de ejecución en el runtime PHP 8.5 del proyecto. El conteo histórico anterior no refleja la cobertura actual.

---

## 13. Conclusión del análisis de trazabilidad

El sistema `citas-dentales` implementa el flujo público de reserva, portal privado y gestión administrativa de servicios, pacientes y agenda. Esta actualización añade horarios por odontólogo, elección de dentista, estado de inasistencia, control de reservas concurrentes, herramientas de Card Sorting y SUS, y verificaciones automatizadas de responsive/accesibilidad.

Sin embargo, para cumplir con el formato completo exigido por `Doc. Final UID.docx`, faltan:

1. **Pendiente de ejecución en el entorno correcto:** correr PHPUnit y Playwright desde el entorno PHP 8.5/Node del proyecto; no se ejecutaron en la máquina global PHP 8.2.
2. **Evaluación con usuarios:** recolectar respuestas reales de Card Sorting y SUS, ejecutar evaluación heurística y realizar pruebas de tareas. La integración técnica no sustituye estas actividades.
3. **Análisis académico:** elaborar tabla de estandarización, matriz de similitud y PCA con los resultados recolectados.
4. **Documentación de apoyo:** wireframes, diagramas ER, capturas, video demo, referencias APA y conclusiones basadas en los resultados.

> **Nota sobre la concurrencia:** las reservas usan el lock compartido de la tabla `cache_locks` antes de abrir la transacción, además de `lockForUpdate()` donde el motor lo admite. Esto permite serializar reservas en SQLite y MySQL mientras las instancias comparten la misma base de datos.
