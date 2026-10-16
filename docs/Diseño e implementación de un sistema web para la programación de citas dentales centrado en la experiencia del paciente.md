# **Proyecto**

## **Diseño e implementación de un sistema web para la programación de citas dentales centrado en la experiencia del paciente**

Consultorio dental particular.

### **Producto**

**Revisión preliminar de implementación, 11 de octubre de 2026.** La hizo el equipo de desarrollo mediante inspección de la interfaz, rutas, validaciones y navegación del navegador. No es una evaluación independiente ni una prueba con pacientes. Severidad: 0 = no es problema; 1 = cosmético; 2 = menor; 3 = importante; 4 = crítico.

| Heurística                                    | Hallazgo observado                                                                                                         | Severidad | Acción / estado                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------: | -------------------------------------------------------------------------------------------------------- |
| Visibilidad del estado del sistema            | El flujo marca servicio, horario, datos y confirmación; la pantalla final presenta referencia, servicio y fecha.           |         1 | Conservado; validar comprensión con participantes.                                                       |
| Relación entre sistema y mundo real           | La interfaz usa nombres, fechas y horas comprensibles y presenta la duración.                                              |         1 | Los servicios y horarios siguen siendo supuestos ficticios que deben confirmarse.                        |
| Control y libertad del usuario                | Hay acciones para volver de paso y cambiar fecha; el paciente puede cancelar con anticipación y revocar el enlace privado. |         2 | Comprobar si el diálogo de confirmación de cancelación es suficientemente claro y accesible con teclado. |
| Consistencia y estándares                     | Botones, campos, colores de estado y navegación mantienen patrones comunes; el tema claro/oscuro es persistente.           |         1 | Revisar consistencia en pantallas pequeñas y en ambos temas.                                             |
| Prevención de errores                         | Se ocultan horarios ocupados, se valida en servidor y una restauración requiere valoración.                                |         2 | Sigue pendiente resolver de forma transaccional dos reservas simultáneas del mismo horario.              |
| Reconocimiento antes que recuerdo             | El resumen repite servicio, fecha, hora, nombre y teléfono antes de confirmar.                                             |         1 | Mantener el resumen como último paso antes de enviar.                                                    |
| Flexibilidad y eficiencia                     | La persona puede volver a servicio, fecha y horario antes de enviar.                                                       |         2 | Medir tiempo y cantidad de retrocesos durante las tareas con usuarios.                                   |
| Diseño estético y minimalista                 | La reserva presenta una decisión principal por paso y no solicita información clínica.                                     |         1 | Mantener el alcance de datos mínimos del prototipo.                                                      |
| Ayuda para reconocer y recuperarse de errores | Los errores de validación se muestran junto al flujo y el horario ocupado solicita elegir otro.                            |         2 | Confirmar asociación de errores con campos y lectura por tecnologías de asistencia.                      |
| Ayuda y documentación                         | Se informa que los datos son de demostración, pero no hay ayuda contextual para casos de cancelación tardía o valoración.  |         2 | Añadir instrucciones breves y evaluar si bastan sin asistencia del equipo.                               |

Los hallazgos describen la inspección del prototipo, no problemas observados en una muestra de usuarios. La severidad deberá revisarse después de las sesiones.

- **Prototipado:** Figma

El sistema estará dirigido principalmente a pacientes que necesitan **consultar disponibilidad y programar una cita**, mientras que el personal del consultorio tendrá herramientas para administrar las citas y la información necesaria para su operación.

Para evitar problemas de privacidad, **no utilizaremos información clínica ni datos personales reales** en el prototipo.

### Protocolo

- Reclutar participantes voluntarios y explicar que se evalúa el sistema, no a la persona; solicitar consentimiento antes de tomar notas.
- Usar solo pacientes, teléfonos y correos ficticios. No pedir datos clínicos ni guardar grabaciones identificables.
- Registrar un identificador anónimo (P01, P02...), dispositivo, viewport y si la tarea se completó sin ayuda.
- Iniciar el cronómetro al leer la consigna; detenerlo cuando se llega al resultado correcto o la persona abandona.
- Contar errores observables (selección equivocada, validación fallida, retroceso no previsto) y ayudas del facilitador. No sugerir el siguiente paso durante la tarea.
- Hacer las mismas tareas y condiciones en cada iteración; conservar resultados individuales anonimizados y reportar la cantidad real de participantes.

### Tareas propuestas

| ID  | Consigna para el participante                                                                         | Éxito observable                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| T01 | Agenda una limpieza dental para el próximo martes a las 10:30, usando los datos ficticios entregados. | Llega a la confirmación con servicio, fecha y hora solicitados; si el horario no está disponible, elige otro y lo indica. |
| T02 | Intenta reservar una restauración simple.                                                             | Identifica que primero debe agendar una valoración y encuentra ese servicio.                                              |
| T03 | Selecciona una fecha sin horarios y encuentra una alternativa.                                        | Cambia el día y selecciona un horario disponible sin ayuda.                                                               |
| T04 | Consulta la cita recién creada y cancélala.                                                           | Abre el enlace privado, identifica la cita y confirma la cancelación.                                                     |
| T05 | Intenta cancelar una cita con menos de 24 horas.                                                      | Comprende el mensaje y que debe comunicarse con el consultorio; la cita no cambia de estado.                              |
| T06 | Como personal, inicia sesión, encuentra una cita y confirma su estado.                                | Accede al panel con una cuenta administradora de prueba y modifica la cita correctamente.                                 |

### Hoja de resultados por tarea

| Participante anónimo | Tarea | Dispositivo / viewport | Éxito (sí/no) | Tiempo (s) | Errores | Ayudas | Dificultad expresada |
| -------------------- | ----- | ---------------------- | ------------- | ---------: | ------: | -----: | -------------------- |
|                      |       |                        |               |            |         |        |                      |

No se han realizado sesiones con participantes al redactar esta versión. Completar esta tabla únicamente con observaciones reales.

El proyecto es pertinente porque la programación de una cita es una interacción que requiere que el usuario comprenda y seleccione diferentes elementos antes de completar una acción.

# **Objetivo general**

Aplicar el cuestionario SUS estándar después de que cada participante termine las tareas. Cada una de las 10 respuestas usa escala de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo). Para puntuar, en los reactivos impares se resta 1 a la respuesta; en los pares se resta la respuesta a 5. Se suman los diez valores y se multiplica por 2.5. El resultado individual va de 0 a 100.

| Participante anónimo | SUS individual (0–100) | Observaciones posteriores |
| -------------------- | ---------------------: | ------------------------- |
|                      |                        |                           |

**Resultado SUS del proyecto:** pendiente de aplicación. No asignar puntuación ni interpretación hasta recopilar respuestas reales; reportar el número de participantes y el método de resumen empleado.

Identificar los requerimientos y las principales interacciones involucradas en el proceso de programación de una cita dental.

### **OE2**

### Comprobación técnica preliminar

En una inspección de la página pública con el navegador integrado se midió `document.documentElement.scrollWidth` en viewports de 320, 768 y 1280 CSS px. En los tres anchos no hubo desbordamiento horizontal. En 320 px se observó que los nombres de los pasos se ocultaban y que el enlace de “Mis citas” no estaba disponible. Se implementaron nombres accesibles para los pasos y se cambió el enlace para usar el acceso privado persistente; la compilación y una nueva comprobación responsive de estos cambios quedan pendientes de ejecutar antes de presentar este documento como validación final.

### Lista de comprobación

### **Caso de estudio**

Consultorio dental particular.

### **Producto**

Aplicación web responsive para pacientes y personal del consultorio.

### **Tecnologías**

- Frontend: React con Inertia.
- Backend: Laravel.
- Base de datos: MySQL.
- Prototipado previsto: Figma.

El sistema se dirige principalmente a pacientes que necesitan consultar disponibilidad y programar citas; el personal tendrá herramientas para administrar la agenda y los datos mínimos necesarios.

### **Problema**

Programar una cita requiere elegir servicio, fecha, horario y proporcionar datos de contacto. Si las opciones y el proceso no se presentan con claridad, la persona puede equivocarse, no encontrar disponibilidad o necesitar asistencia.

### **Pregunta de investigación**

¿Cómo diseñar una interfaz web que facilite a los pacientes la búsqueda y programación de citas dentales de manera clara, eficiente y accesible?

### **Justificación**

La programación de una cita es una interacción con varias decisiones dependientes. Diseñar el flujo desde las tareas y necesidades de sus usuarios permite estudiar efectividad, eficiencia y satisfacción dentro de un contexto de uso concreto, conforme al enfoque de usabilidad revisado en clase.

# **Objetivo general**

Diseñar e implementar un sistema web para programar y gestionar citas dentales centrado en la experiencia del paciente, que facilite consultar servicios, disponibilidad y horarios mediante una interfaz clara, eficiente y accesible.

## **Objetivos específicos**

### **OE1**

Identificar los requerimientos y las principales interacciones del proceso de programación de una cita dental.

### **OE2**

Diseñar la arquitectura de información y los flujos necesarios para que el paciente programe una cita.

### **OE3**

Diseñar una interfaz consistente que facilite comprender servicios, fechas, horarios y estados.

### **OE4**

Incorporar prevención, detección y recuperación de errores durante el proceso.

### **OE5**

Implementar la gestión de servicios, horarios, pacientes y citas.

### **OE6**

Incorporar criterios básicos de accesibilidad.

### **OE7**

Evaluar usabilidad mediante revisión heurística y tareas con participantes.

### **OE8**

Analizar resultados y realizar mejoras iterativas.

### **Alcance y restricciones iniciales**

El producto es una GUI web responsive. Debe ocultar la complejidad de la agenda y la base de datos, usar términos cotidianos, mostrar el estado de las acciones y permitir continuar o volver dentro del flujo. La interfaz principal del paciente y el panel interno son tareas distintas.

| Restricción      | Definición del prototipo                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Plataformas      | Escritorio, tablet y teléfono; viewports CSS de referencia 320, 375, 768 y 1280 px.                                    |
| Navegadores      | Chrome, Firefox y Edge como objetivos de prueba; la verificación actual se realizó principalmente en Chrome integrado. |
| Privacidad       | Solo datos ficticios; no se solicita ni almacena información clínica.                                                  |
| Datos operativos | Servicios, duración y horarios provisionales, pendientes de validación con el consultorio.                             |
| Acceso           | Reserva pública separada del panel administrativo, protegido con login y rol.                                          |

### **Estado del análisis centrado en usuarios**

Los perfiles de paciente y personal son perfiles de diseño derivados del alcance, no resultados de entrevistas ni una muestra estadística. Aún se debe entrevistar u observar al consultorio para documentar su flujo actual, frecuencia, interrupciones, problemas, información y terminología. La reserva pública implementa una tarea futura propuesta; no representa un proceso actual verificado.

### **Especificaciones preliminares de usabilidad**

Son metas de diseño para validar, no resultados observados:

| Atributo              | Meta propuesta                                                                            | Método de verificación                                           |
| --------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Efectividad           | Al menos 80 % de participantes completa T01 sin ayuda durante el piloto.                  | Tareas completadas sin ayuda / participantes que intentaron T01. |
| Eficiencia            | Mediana de T01 menor o igual a 3 minutos en el piloto.                                    | Cronómetro desde lectura de la consigna hasta confirmación.      |
| Prevención de errores | Cero reservas de horario ocupado y cero servicios restringidos reservados sin valoración. | Pruebas funcionales más registro de errores observados.          |
| Satisfacción          | Aplicar SUS y reportar el resultado real sin fijar un puntaje anticipado.                 | Cuestionario SUS estándar posterior a las tareas.                |

# **Funcionalidades del MVP**

### **F09 — Gestionar citas**

Consultar, modificar y cancelar.

### **F10 — Consultar pacientes**

Información mínima necesaria para gestionar las citas.

# **Requisitos no funcionales**

Aquí empieza a entrar directamente Diseño de Interfaces.

### **RNF01 — Usabilidad**

El flujo principal deberá poder completarse sin asistencia externa.

### **RNF02 — Accesibilidad**

La interfaz deberá considerar:

- contraste;
- tamaño adecuado de texto;
- navegación por teclado;
- indicadores de foco;
- labels;
- mensajes de error comprensibles;
- información no dependiente únicamente del color.

### **RNF03 — Responsive**

La interfaz deberá funcionar en:

- escritorio;
- tablet;
- móvil.

### **RNF04 — Consistencia**

Los componentes visuales y patrones de interacción deberán mantener un comportamiento uniforme.

### **RNF05 — Retroalimentación**

Las acciones importantes deberán producir una respuesta clara:

Guardando...

      ↓

✓ Cita confirmada

o:

✕ No se pudo reservar el horario.

Selecciona otro horario disponible.

**hipótesis de usabilidad**

**H1: Un proceso de programación dividido en pasos claramente identificados permitirá a los pacientes completar la tarea con menor cantidad de errores y una menor carga cognitiva que un formulario único que presente simultáneamente todos los campos necesarios.**

**Paciente**

**↓**

**Contacta al consultorio**

**↓**

**Solicita cita**

**↓**

**Personal consulta agenda**

**↓**

**Se ofrecen horarios**

**↓**

**Paciente selecciona**

**↓**

**Se registra cita**

### **2.3 Reglas del dominio**

**Por ejemplo:**

- **duración de servicios;**
- **horarios;**
- **disponibilidad;**
- **cancelaciones;**
- **citas simultáneas;**
- **anticipación mínima;**
- **etc.**

---

# **3\. Usuarios**

**Aquí documentaremos:**

### **3.1 Usuario principal**

**Paciente**

### **3.2 Usuario secundario**

**Personal del consultorio**

### **3.3 Personas / perfiles**

**Podemos crear uno o dos perfiles representativos.**

**Por ejemplo:**

> **María, 42 años, utiliza principalmente el teléfono para realizar trámites y busca una forma sencilla de programar una cita sin tener que llamar al consultorio.**

**No necesitamos inventar que María representa estadísticamente a todos los pacientes. Será un perfil de diseño, no una investigación demográfica.**

---

# **4\. Requerimientos**

**Aquí entra lo que ya empezamos.**

### **4.1 Requerimientos funcionales**

**F01, F02, F03...**

### **4.2 Requerimientos no funcionales**

**RNF01, RNF02...**

### **4.3 Reglas de negocio**

**Por ejemplo:**

> **Un horario no puede ser reservado por dos pacientes simultáneamente.**

> **Una cita cancelada libera el horario correspondiente.**

> **La duración del servicio determina los bloques de disponibilidad necesarios.**

**Esto será especialmente importante para el desarrollo.**

---

# **5\. Arquitectura de información**

**Aquí explicaremos cómo organizamos el contenido.**

**Por ejemplo:**

**Sistema**

**│**

**├── Inicio**

**│**

**├── Agendar cita**

**│ ├── Servicio**

**│ ├── Fecha**

**│ ├── Horario**

**│ ├── Datos**

**│ └── Confirmación**

**│**

**└── Mis citas**

    **├── Próximas**

    **└── Historial**

**Para administración:**

**Administración**

**│**

**├── Dashboard**

**├── Citas**

**├── Pacientes**

**├── Servicios**

**└── Horarios**

---

# **6\. Flujos de usuario**

**Aquí documentamos los principales User Flows.**

**Por ejemplo:**

### **Flujo 01 — Programar cita**

**Inicio**

**↓**

**Servicio**

**↓**

**Fecha**

**↓**

**Horario**

**↓**

**Datos**

**↓**

**Confirmación**

**↓**

**Éxito**

### **Flujo 02 — Cancelar cita**

**Mis citas**

**↓**

**Seleccionar cita**

**↓**

**Cancelar**

**↓**

**Confirmar**

**↓**

**Cita cancelada**

### **Flujo 03 — Personal administra agenda**

**etc.**

---

# **7\. Diseño de interfaz**

**Esta será una sección importante.**

## **7.1 Wireframes**

**Presentaremos las primeras versiones de las pantallas.**

## **7.2 Sistema visual**

- **colores;**
- **tipografía;**
- **espaciado;**
- **iconografía;**
- **botones;**
- **formularios;**
- **tarjetas;**
- **estados;**
- **mensajes.**

## **7.3 Componentes**

**Por ejemplo:**

**Button**

**Input**

**Select**

**ServiceCard**

**DoctorCard**

**DateSelector**

**TimeSlot**

**AppointmentCard**

**Alert**

**Modal**

## **7.4 Diseño responsive**

**Mostraremos cómo cambia la interfaz entre:**

- **escritorio;**
- **tablet;**
- **móvil.**

---

# **8\. Prototipo**

**Aquí entra Figma.**

**Documentaremos:**

- **prototipo inicial;**
- **flujo interactivo;**
- **pantallas principales;**
- **decisiones de diseño.**

**Y podemos incluir capturas.**

---

# **9\. Evaluación de la interfaz**

La revisión heurística, las pruebas técnicas y el estudio con participantes son métodos distintos. Los hallazgos siguientes corresponden a una inspección interna del prototipo; no son resultados de usuarios.

## **9.1 Evaluación heurística**

**Inspección heurística interna, 11 de octubre de 2026.** Severidad: 0 = no es problema; 1 = cosmético; 2 = menor; 3 = importante; 4 = crítico. La severidad se debe revisar con participantes.

| Heurística                                    | Hallazgo de inspección                                                                        | Severidad | Acción / estado                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | --------: | ---------------------------------------------------------------------------------------- |
| Visibilidad del estado del sistema            | Los pasos, horarios disponibles, estados y confirmación hacen visible el progreso.            |         1 | Conservar y validar comprensión con usuarios.                                            |
| Relación entre sistema y mundo real           | Los textos describen servicios, fecha, hora y duración en español.                            |         1 | Reglas y servicios aún son supuestos ficticios.                                          |
| Control y libertad del usuario                | Se puede volver entre pasos; el paciente puede cancelar con anticipación y revocar su enlace. |         2 | Revisar el diálogo de cancelación con teclado/lector.                                    |
| Consistencia y estándares                     | La navegación, controles, estados y modo oscuro usan patrones compartidos.                    |         1 | Revisar consistencia entre tamaños de pantalla.                                          |
| Prevención de errores                         | El servidor valida fecha, disponibilidad, antelación y servicios sujetos a valoración.        |         2 | Riesgo pendiente: reservas simultáneas del mismo bloque no tienen bloqueo transaccional. |
| Reconocimiento antes que recuerdo             | Antes de confirmar se muestra un resumen de servicio, horario y contacto.                     |         1 | Mantener el resumen previo al envío.                                                     |
| Flexibilidad y eficiencia                     | Se puede volver a servicio, fecha u horario antes de confirmar.                               |         2 | Medir retrocesos y tiempo en las tareas.                                                 |
| Diseño estético y minimalista                 | La reserva separa decisiones por pasos y solicita datos de contacto mínimos.                  |         1 | Mantener el alcance sin datos clínicos.                                                  |
| Ayuda para reconocer y recuperarse de errores | Se muestran errores de validación y se explica que se elija otro horario.                     |         2 | Verificar anuncios y asociación con campos mediante tecnología de asistencia.            |
| Ayuda y documentación                         | Se advierte que los datos son demostrativos; no hay ayuda contextual para todos los casos.    |         2 | Evaluar si las instrucciones bastan sin ayuda externa.                                   |

La tabla registra una inspección del equipo de desarrollo, no una evaluación independiente ni una muestra de pacientes.

---

## **9.2 Prueba de tareas**

### Protocolo

- Invitar participantes voluntarios y explicar que se evalúa la interfaz, no a la persona; solicitar consentimiento antes de tomar notas.
- Usar únicamente pacientes, teléfonos y correos ficticios. No pedir ni guardar datos clínicos o personales reales.
- Registrar un identificador anónimo (P01, P02...), dispositivo, viewport y si completó la tarea sin ayuda.
- Iniciar el tiempo al leer la consigna y detenerlo al completar o abandonar. Contar selecciones erróneas, validaciones fallidas, retrocesos y ayudas del facilitador.
- No sugerir pasos durante la tarea. Hacer las mismas tareas y condiciones en cada iteración.

### Tareas

| ID  | Consigna                                                                                          | Éxito observable                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| T01 | Agenda una limpieza dental para el próximo martes a las 10:30 con los datos ficticios entregados. | Llega a la confirmación con servicio, fecha y hora correctos; si el horario no está disponible, escoge otro y lo explica. |
| T02 | Intenta reservar una restauración simple.                                                         | Detecta que se requiere valoración y encuentra cómo reservarla primero.                                                   |
| T03 | Elige un día sin horarios y encuentra otra fecha.                                                 | Cambia de fecha y selecciona un horario sin ayuda.                                                                        |
| T04 | Consulta la cita recién creada y cancélala.                                                       | Abre “Mis citas”, identifica la reserva y confirma su cancelación.                                                        |
| T05 | Intenta cancelar una cita con menos de 24 horas.                                                  | Comprende que debe contactar al consultorio y observa que la cita no cambia.                                              |
| T06 | Como personal, inicia sesión y confirma una cita.                                                 | Entra con cuenta administrativa ficticia, encuentra la cita y cambia su estado.                                           |

### Registro por participante y tarea

| Participante anónimo | Tarea | Dispositivo / viewport | Éxito (sí/no) | Tiempo (s) | Errores | Ayudas | Dificultad expresada |
| -------------------- | ----- | ---------------------- | ------------- | ---------: | ------: | -----: | -------------------- |
|                      |       |                        |               |            |         |        |                      |

No se han realizado sesiones con participantes al redactar esta versión. Completar la tabla solo con observaciones reales.

---

## **9.3 SUS**

Aplicar el cuestionario SUS estándar después de las tareas. Cada reactivo se responde en escala de 1 a 5. Puntaje: en los reactivos impares se resta 1 a la respuesta; en los pares se resta la respuesta a 5; se suman los diez valores y se multiplica por 2.5. El resultado individual va de 0 a 100.

| Participante anónimo | SUS individual (0–100) | Observaciones |
| -------------------- | ---------------------: | ------------- |
|                      |                        |               |

**Resultado SUS del proyecto:** pendiente de aplicación. No asignar puntaje ni interpretación hasta recopilar respuestas reales; reportar el número de participantes y el método de resumen.

---

## **9.4 Evaluación de accesibilidad**

### Comprobación técnica preliminar

El 11 de octubre de 2026 se inspeccionó la reserva pública en el navegador integrado. Se midió el ancho del documento en viewports de 320, 768 y 1280 CSS px: no hubo desbordamiento horizontal en ninguno. En 320 px se observó que los nombres de pasos estaban ocultos y que “Mis citas” no aparecía. Se implementaron nombres accesibles para pasos y el enlace al portal en todas las anchuras; queda pendiente repetir la medición tras compilar esta iteración.

### Lista de comprobación

| Criterio                 | Prueba                                                                                                 | Estado                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Contraste                | Medir texto normal, texto pequeño, controles y estados en tema claro/oscuro.                           | Pendiente de auditoría con herramienta.                                     |
| Teclado                  | Completar reserva, login, consulta y cancelación usando Tab, Shift+Tab, Enter, Espacio y Escape.       | Pendiente de sesión documentada.                                            |
| Foco                     | Comprobar indicador visible, orden lógico, foco después de errores y retorno desde confirmación/modal. | Pendiente.                                                                  |
| Etiquetas y errores      | Confirmar nombre accesible de cada campo y asociación del mensaje con el campo inválido.               | Labels y asociaciones de error añadidos; verificación con lector pendiente. |
| Zoom y controles móviles | Revisar 320/375 CSS px, objetivos táctiles y zoom de Safari al enfocar.                                | Inputs principales usan 16 px; probar en dispositivo real.                  |
| Color                    | Verificar que estado, selección y errores tienen texto/icono además del color.                         | Pendiente de revisión completa.                                             |
| Tecnología de asistencia | Recorrer encabezados, pasos, formulario, resumen y cancelación con un lector de pantalla.              | Pendiente.                                                                  |

Esta inspección no certifica conformidad WCAG y no reemplaza la evaluación con tecnología de asistencia.

---

# **10\. Iteración del diseño**

La evidencia siguiente es de inspección del equipo, no de participantes. Tras el estudio, agregar hallazgos de usuario separados y enlazarlos con las tareas de la sección 9.2.

| Iteración | Evidencia observada                                                                     | Cambio                                                                                              | Estado de validación                                       |
| --------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| I01       | A 320 CSS px no se leían los nombres de los pasos y no aparecía “Mis citas”.            | Nombres de pasos accesibles y enlace al acceso privado en móvil.                                    | Implementado; recompilar y repetir viewport/teclado.       |
| I02       | Inputs de contacto con texto menor de 16 px y mensajes no asociados a todos los campos. | Inputs de fecha/contacto a 16 px; `aria-invalid` y `aria-describedby` en nombre, teléfono y correo. | Implementado; falta comprobar Safari y lector de pantalla. |
| I03       | El nombre de “Revocar acceso” desaparecía en móvil junto con el texto visible.          | Añadido nombre accesible al control y explicación de privacidad del enlace.                         | Implementado; falta verificar con lector.                  |
| I04       | Un servicio restringido podía aparentar ser reservable sin valoración previa.           | Restauración marcada en interfaz y validada en servidor; se ofrece reservar valoración primero.     | Prueba funcional añadida; repetir suite final.             |

Para cada siguiente iteración: conservar la captura o registro inicial, describir el problema observado, asignar severidad, implementar un cambio y repetir la misma tarea en las mismas condiciones. No usar frecuencias de ejemplo como evidencia real.

---

# **11\. Implementación**

**Aquí ya entra el desarrollo.**

### **11.1 Arquitectura técnica**

**React + Inertia**

**↓**

**Rutas web y controladores Laravel**

**↓**

**MySQL**

### **11.2 Base de datos**

**Diagrama ER.**

### **11.3 Backend**

- **modelos;**
- **controladores;**
- **endpoints;**
- **validaciones.**

### **11.4 Frontend**

- **componentes;**
- **páginas;**
- **consumo de API;**
- **estados.**

---

# **12\. Pruebas del sistema**

**Aquí debemos separar pruebas de interfaz/usabilidad de pruebas técnicas.**

### **12.1 Pruebas funcionales**

Las pruebas automatizadas demuestran contratos del sistema, no usabilidad. La última ejecución completa reportada antes de la iteración responsive fue **23 pruebas y 158 aserciones aprobadas**; repetirla después de los cambios recientes y registrar PHP, base de prueba y fecha.

| Caso                | Resultado esperado      | Resultado                                                      |
| ------------------- | ----------------------- | -------------------------------------------------------------- |
| **Crear cita**      | **Cita registrada**     | **Cubierto por pruebas automatizadas; repetir en suite final** |
| **Horario ocupado** | **No permite reservar** | **Cubierto por pruebas automatizadas; repetir en suite final** |
| **Cancelar cita**   | **Estado cambia**       | **Cubierto por pruebas automatizadas; repetir en suite final** |

### **12.2 Validaciones**

- **campos obligatorios;**
- **fechas;**
- **horarios;**
- **duplicados;**
- **etc.**

### **12.3 Pruebas responsive**

- Viewports CSS que deben comprobarse: 320, 375, 768 y 1280 px.
- En cada viewport: ausencia de scroll horizontal, texto sin recortes, controles utilizables, pasos con nombre comprensible y modal/confirmación dentro del área visible.
- Registrar dispositivo/navegador, viewport CSS, resultado y captura anonimizada. El chequeo preliminar de 320/768/1280 px se describe en 9.4; falta repetirlo tras los cambios.

### **12.4 Pruebas de accesibilidad**

Completar la lista de 9.4 con teclado, foco, contraste medido, etiquetas, errores, zoom móvil y lector de pantalla. Registrar versión de navegador/herramienta, criterio, resultado y evidencia; no declarar conformidad WCAG sin una auditoría completa.

---

# **13\. Resultados**

**Estado actual de resultados:** no se han realizado sesiones con participantes, cuestionario SUS ni auditoría formal de accesibilidad. Por ello, no hay tasas de éxito, tiempos promedio, errores de usuario ni puntuación SUS que reportar.

| Indicador                                      | Resultado real | Fuente / fecha |
| ---------------------------------------------- | -------------- | -------------- |
| Participantes que completaron todas las tareas | Pendiente      |                |
| Tasa de éxito por tarea                        | Pendiente      |                |
| Tiempo por tarea                               | Pendiente      |                |
| Errores y ayudas por tarea                     | Pendiente      |                |
| SUS (n y estadístico usado)                    | Pendiente      |                |
| Hallazgos heurísticos confirmados por usuarios | Pendiente      |                |
| Hallazgos de accesibilidad y severidad         | Pendiente      |                |
| Cambios validados en segunda iteración         | Pendiente      |                |

Cuando existan datos, reportar denominadores, condiciones, dispersión o método de resumen y limitaciones. No rellenar celdas con ejemplos, estimaciones o valores objetivo como si fueran resultados.

---

# **14\. Conclusiones**

**Aquí respondemos:**

> **¿Se cumplió el objetivo?**

> **¿Qué problemas se encontraron?**

> **¿Qué mejoras produjo la evaluación?**

> **¿Qué limitaciones tuvo el proyecto?**

> **¿Qué podría implementarse posteriormente?**

---

# **15\. Referencias**

**Aquí sí pondremos las fuentes utilizadas:**

- **Nielsen;**
- **principios de usabilidad;**
- **accesibilidad;**
- **SUS;**
- **documentación técnica;**
- **React;**
- **Laravel;**
- **etc.**

---

# **16\. Anexos**

**Podemos incluir:**

- **cuestionario SUS;**
- **tareas de prueba;**
- **tablas completas;**
- **wireframes;**
- **capturas;**
- **diagramas;**
- **resultados;**
- **etc.**

**¿Qué servicios ofrecen?**

**¿Cuánto dura normalmente cada servicio?**

**¿Qué servicios requieren primero una valoración?**

**¿Qué días y horarios atienden?**

**¿Cómo se asignan actualmente las citas?**

**¿Cómo sabe qué horarios están disponibles?**

**¿Cuánto espacio deja entre pacientes?**

**¿Qué pasa cuando alguien cancela?**

**¿Qué pasa cuando alguien no se presenta?**

**¿Con cuánta anticipación puede alguien solicitar una cita?**

**¿Hay horarios que no deberían aparecer como disponibles?**

**¿Una misma persona puede tener varias citas programadas?**

**¿Quién se encarga de administrar/modificar la agenda?**

**¿Qué situaciones suelen complicar la programación de una cita?**

## Supuestos operativos para el prototipo

Los siguientes valores son **ficticios y provisionales**. Sirven para implementar y evaluar el flujo en clase; no describen la operación real de un consultorio ni sustituyen la validación con su personal.

| Información                       | Valor provisional para el prototipo                                                                                                                                   |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Servicios                         | Valoración general, revisión dental, limpieza dental y restauración simple                                                                                            |
| Duración                          | Valoración: 30 min; revisión: 30 min; limpieza: 45 min; restauración simple: 60 min                                                                                   |
| Valoración previa                 | En esta plantilla ficticia, restauración simple requiere reservar primero una valoración general; validar esta regla con el personal antes de ofrecerla públicamente. |
| Días de atención                  | Lunes a viernes                                                                                                                                                       |
| Horario de atención               | 08:00–18:00, hora local de la clínica; sin disponibilidad en días cerrados                                                                                            |
| Intervalo entre horas de inicio   | 30 min                                                                                                                                                                |
| Anticipación mínima para reservar | 24 horas                                                                                                                                                              |
| Tiempo de preparación entre citas | 15 min; se bloquea junto con la duración del servicio                                                                                                                 |
| Cancelación                       | Permitida hasta 24 horas antes; al cancelar, el horario vuelve a estar disponible                                                                                     |
| Cancelación tardía                | El prototipo indica que se debe contactar al consultorio; no define penalizaciones                                                                                    |
| Inasistencia                      | El personal la registra como estado de la cita; no se aplican penalizaciones en el prototipo                                                                          |
| Varias citas por paciente         | Permitidas; cada cita debe respetar la disponibilidad                                                                                                                 |
| Registro                          | El personal puede registrar citas desde el panel; el paciente usa el flujo público de reserva                                                                         |
| Datos de paciente                 | Nombre y teléfono; correo opcional. No solicitar ni almacenar información clínica en el prototipo                                                                     |
| Datos de prueba                   | Solo nombres, teléfonos y correos ficticios; nunca usar información personal real                                                                                     |

Antes de presentar el sistema como una solución operativa, se deben sustituir estos supuestos por respuestas confirmadas del consultorio.
