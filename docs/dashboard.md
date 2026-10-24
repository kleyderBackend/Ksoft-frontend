# Dashboard de Ksoft

El panel privado está conectado a Supabase Auth, PostgreSQL y Storage. La web pública consulta una copia separada del contenido publicado. Esta guía describe la organización de los módulos y distingue el funcionamiento conectado del modo local de desarrollo.

## Organización

Cada módulo mantiene su página y CSS en `src/pages/Dashboards/<Módulo>/` y su gestor y CSS Module en `src/Components/dashboards/components/<Módulo>/`. Las páginas componen encabezados y gestores. Los formularios compartidos y las reglas de negocio se reutilizan en `components/shared/` y los modelos del dashboard.

## Módulos

| Área | Funciones |
| --- | --- |
| Dashboard | Indicadores desde registros, finanzas, próximas tareas y actividad; vista de trabajo según rol. |
| Publicaciones y productos | Edición de fichas y textos, medios, vistas previas, borradores y publicación explícita. |
| Proyectos | Clientes, SaaS propios y proyectos internos; alcance, fechas, avance, tareas y asignación de equipo. |
| Presentación pública | Fichas comerciales independientes para casos de proyectos. |
| Tareas | Relación con proyecto, prioridad, fechas, estado, notas y responsables autorizados. |
| Solicitudes | Consultas y solicitudes de piloto recibidas desde la web, seguimiento y asociación a contactos. |
| Contactos y clientes | Gestión comercial y conversión de prospectos conservando las relaciones. |
| Cotizaciones | Alcance, condiciones, impresión/PDF y creación de un proyecto desde una cotización aceptada. |
| Pagos, gastos y reportes | Registros administrativos, pendientes, totales y exportación CSV; no ejecutan pagos. |
| Soporte | Casos relacionados con clientes y registro de resolución. |
| Archivos | Documentos privados de hasta 500 KB, descarga y relación opcional con proyectos. |
| Equipo | Crear empleados, cambiar roles y suspender accesos. |
| Tickets internos | Consultas entre equipo y administración con conversaciones, asignación y estados. |
| Mi perfil | Consulta de la cuenta y cambio personal de contraseña. |
| Recuperación | Papelera, restauración, historial de cambios y respaldos del espacio de trabajo. |
| Configuración | Empresa, publicación conjunta y exportación o importación del espacio de trabajo. |

## Modo conectado

El acceso comienza en `/dashboard/access`. Supabase Auth identifica al usuario y las funciones de PostgreSQL comprueban su rol. Administración mantiene el menú completo; Development y QA reciben solo proyectos y tareas asignados; Empleado accede al perfil y a sus tickets. Los permisos completos se describen en [equipo-y-tickets.md](equipo-y-tickets.md).

Los guardados del espacio utilizan una revisión compartida para detectar cambios en otras pestañas o nuevas solicitudes. Un conflicto evita sobrescribir los datos recientes. Las asignaciones, los tickets y la gestión de empleados tienen operaciones específicas del servidor.

Los formularios conservan validaciones, estados de espera y avisos de cambios sin guardar. El historial detallado del panel es distinto del registro de auditoría del servidor.

## Contenido y publicación

Productos y Presentación pública permiten editar tarjetas, botones, público, modelo de cobro, problema, solución, beneficios, funcionalidades, portada, galería, secciones y preguntas. Las imágenes conservan título, texto alternativo, pie y dimensiones.

**Publicar en la web** guarda y publica la entrada en una transacción. **Guardar borrador** conserva cambios privados y mantiene cualquier versión pública anterior. **Retirar de la web** quita la publicación y conserva el registro privado. La papelera también retira la versión pública de la ficha archivada.

Las imágenes comerciales se alojan en el bucket público `ksoft-media`; no debe utilizarse para documentos privados. Los archivos privados permanecen incluidos en los registros del espacio de trabajo.

## Relaciones y proyectos propios

El flujo comercial enlaza solicitud → contacto → cliente → cotización → proyecto → tarea o archivo. Una cotización aceptada puede originar un proyecto, evitando duplicados activos o en la papelera.

Los SaaS y proyectos propios no necesitan cliente ni cotización. Un SaaS puede vincularse a una ficha de Productos. Primero se asigna el equipo al proyecto; después se asignan sus tareas entre esos integrantes. Consulta el [procedimiento completo](equipo-y-tickets.md#proyectos-propios-y-desarrollo-de-saas).

La presentación pública no se genera automáticamente desde notas o documentos internos.

## Recuperación y límites

La papelera permite restaurar registros y valida relaciones y duplicados. El historial del panel conserva los últimos 100 cambios. Los respaldos JSON incluyen contenido, registros comerciales y operativos, documentos del módulo Archivos, configuración, papelera e historial.

Los respaldos del panel **no incluyen** usuarios de Auth, asignaciones de cuentas, tablas de tickets, auditoría de servidor ni los archivos binarios del bucket de imágenes. Esos elementos necesitan una estrategia de respaldo adicional en Supabase. Restaurar registros privados tampoco restaura automáticamente una versión pública anterior.

El límite actual es 500 KB por documento y 6 MB por guardado completo del espacio. Las imágenes comerciales admiten PNG/JPG/WebP de hasta 500 KB.

## Modo local de desarrollo

Cuando no se configura ninguna variable de Supabase, el modo local está disponible únicamente en desarrollo. Los registros se guardan en `localStorage`, bajo `ksoft-admin-content-v1`, para el mismo navegador y origen. No tiene autenticación ni los servicios conectados de empleados, asignaciones o tickets; tampoco publica contenido remoto.

Una configuración parcial o inválida de Supabase bloquea el acceso conectado. No utiliza la copia local para reemplazar datos remotos. La migración de una copia local requiere una acción explícita desde Configuración y confirmación antes de reemplazar el espacio remoto.

`/dashboard/proyects` redirige a `/dashboard/projects` para conservar enlaces anteriores.

## Comprobaciones

Ejecuta `npm run lint`, `npm test` y `npm run build`. Las pruebas SQL comprueban permisos, aislamiento de datos, relaciones, publicación y reversión de guardados inválidos. La configuración y las verificaciones conectadas están en [supabase.md](supabase.md).
