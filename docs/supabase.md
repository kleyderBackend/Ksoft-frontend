# Supabase para Ksoft

La integración está implementada y conectada al proyecto `umpebmrycbyoucrtntpi`. Se aplicaron las migraciones, se inicializó el catálogo privado existente y se configuraron las cuentas de administrador y desarrollador solicitadas. El registro público de cuentas está desactivado. La URL y las claves están en `.env.local`, excluido de Git. No se publicaron fichas nuevas ni se importaron automáticamente los registros del navegador.

## 1. Crear el proyecto

En tu organización de Supabase, crea un proyecto llamado `ksoft-web`. Elige una región cercana a tus usuarios y escribe tú la contraseña de la base de datos en Supabase. No hace falta compartir esa contraseña con este proyecto ni en el chat.

## 2. Instalar la base de datos y autorizar tu cuenta

Para un proyecto nuevo, ejecuta `npx supabase login`, `npx supabase link --project-ref REFERENCIA` y `npx supabase db push`. También puedes aplicar los archivos de `supabase/migrations/` por orden desde SQL Editor. Cada migración es transaccional. No ejecutes otra vez manualmente una migración ya aplicada, ni las instales sobre los proyectos de Dental o Travel.

En Authentication crea tu usuario de administrador. Introduce tú su contraseña directamente en Supabase. Después autoriza **su correo real** con este SQL (sustituye el ejemplo):

```sql
insert into public.ksoft_admins(user_id)
select id from auth.users where lower(email) = lower('TU_CORREO_REAL')
on conflict do nothing;
```

Comprueba que se insertó un usuario. Tener una cuenta en Supabase Auth por sí solo no da acceso al panel. Para la administración inicial hace falta pertenecer a `ksoft_admins`; las cuentas de Development, QA y Empleado se gestionan después desde Equipo. Desactiva el registro público de cuentas para este panel en la configuración de Auth. El sitio no ofrece un formulario de registro.

## 3. Configurar el proyecto local

Copia `.env.example` a `.env.local` y reemplaza sus valores. La URL del proyecto es del tipo `https://REFERENCIA.supabase.co`; no uses el enlace del dashboard de la organización.

- `VITE_SUPABASE_URL`: URL del proyecto.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: clave pública publishable (también se admite la antigua anon en `VITE_SUPABASE_ANON_KEY`).
- `SUPABASE_URL`: la misma URL para el endpoint de contacto.
- `SUPABASE_SERVICE_ROLE_KEY`: clave legacy service_role, **solo en el servidor**, para registrar solicitudes y crear empleados autorizados. Nunca debe llevar prefijo `VITE_`, aparecer en el código público o enviarse por chat.

Reinicia `npm run dev`. El middleware local carga únicamente las variables necesarias para el endpoint. En Vercel configura las mismas variables en el entorno correspondiente y vuelve a desplegar: Vite incorpora las variables públicas durante la compilación. Si usas un hosting distinto, necesitas alojar también `/api/contact` y `/api/team` como funciones de servidor.

Las variables privadas están excluidas de Git. `.env.example` contiene únicamente ejemplos sin credenciales.

## 4. Primer acceso y migración

Entra a `/dashboard/access` con tu cuenta autorizada. Una configuración incompleta bloquea el panel: no cambia silenciosamente al modo local. Sin configurar Supabase, el panel local sigue disponible únicamente en desarrollo.

Antes de migrar, exporta un respaldo desde el panel local. En Configuración puedes importar ese JSON o utilizar «Importar mi copia local a Supabase» desde el mismo navegador y origen donde estaban tus datos. Se pide confirmación antes de reemplazar los registros remotos y no se borra la copia local original.

El proyecto actual ya está inicializado con las fichas existentes. En instalaciones nuevas puedes generar `supabase/seed.sql` con `node --experimental-strip-types scripts/generate-supabase-seed.mjs` y aplicarlo mediante `npx supabase db query --linked --file supabase/seed.sql`. Ese seed no reemplaza un espacio inicializado ni publica contenido. También se puede inicializar guardando la configuración de empresa desde el panel.

## 5. Publicar contenido

Edita Productos y Proyectos → Presentación pública. Revisa las vistas previas; marca las fichas completas como «Preparado» y «Visible». En Publicaciones, prepara los textos que quieras publicar. Guardar mantiene los cambios privados.

Cada editor tiene «Publicar en la web», que guarda y publica esa ficha en una transacción. «Guardar borrador» conserva los cambios privados y mantiene cualquier versión pública anterior. «Retirar de la web» quita la versión pública sin perder el contenido privado. En Configuración, la publicación conjunta reemplaza el catálogo público con las fichas preparadas y visibles, y las publicaciones preparadas. Publicar una selección vacía retira el contenido publicado. Las novedades aparecen en el inicio; los proyectos públicos se presentan con las tarjetas y detalles existentes. El catálogo inicial de los productos existentes ya se copió a la tabla pública. Las nuevas publicaciones tienen página propia en `/novedades/:slug`.

Los visitantes leen una copia pública separada. Nunca leen directamente los registros de clientes, pagos, documentos, papelera o historial. Las imágenes comerciales cargadas desde los formularios se suben a `ksoft-media`, un bucket público limitado a PNG/JPG/WebP de hasta 500 KB. No lo uses para documentos privados. Las imágenes ya cargadas no se borran automáticamente al editar o archivar una ficha, para no romper referencias publicadas.

Los archivos privados del módulo Archivos siguen guardándose como contenido binario dentro de registros privados de PostgreSQL (hasta 500 KB por archivo); así permanecen incluidos en los respaldos actuales. Esta versión limita cada guardado del espacio completo a 6 MB. Una migración futura de esos documentos a un bucket privado y guardados incrementales permitirá ampliar esos límites sin cambiar el diseño del panel.

## 6. Solicitudes de la web

Con las dos variables de servidor configuradas, `/api/contact` guarda las consultas en Supabase y confirma éxito solo después de recibir el identificador guardado. Conserva el producto y el propósito del piloto. No envía simultáneamente la consulta al antiguo Apps Script. Sin configurar esas variables, el proveedor anterior continúa funcionando. Una configuración de servidor incompleta falla explícitamente, sin redirigir datos a otro proveedor.

El RPC de recepción solo puede ejecutarlo el servidor con service_role; el público no tiene permisos para consultar ni escribir las tablas privadas. Se limita a una solicitud por correo cada 60 segundos mediante una huella hash. No hay confirmaciones por correo automáticas en esta integración. Si llega una solicitud mientras editas, el control de versión impide sobrescribirla; exporta tus cambios antes de recargar y vuelve a aplicarlos sobre la versión actual.

## Estructura y permisos

- `ksoft_admins`: lista de usuarios autorizados; cada usuario solo consulta su propia membresía. El cliente no puede conceder permisos.
- `ksoft_records`: registros por módulo e identificador, con payload JSONB compatible con los formularios existentes y su orden. No es una tabla única que mezcle todos los datos en una sola fila.
- `ksoft_workspace`: configuración, notificaciones leídas, papelera, historial y actividad, más la revisión compartida.
- `ksoft_public_site`: copia comercial publicada, de solo lectura para visitantes.
- `ksoft_audit`: registro de servidor de autor, fecha, acción y revisión. Los clientes no pueden modificarlo. El historial detallado del panel conserva su función de recuperación local de cambios y forma parte del documento guardado.
- `ksoft_intake_limits`: control temporal de repetición del formulario.
- `ksoft_developers`: perfiles del equipo, rol y estado de acceso; conserva el nombre histórico de la tabla.
- `ksoft_assignments`: asignaciones de cuentas a proyectos y tareas.
- `ksoft_tickets`, `ksoft_ticket_messages` y `ksoft_ticket_reads`: solicitudes internas, conversación y estado de lectura.

Las escrituras privadas se realizan mediante RPC autorizados y transaccionales. Una revisión desactualizada revierte toda la operación. La base también valida relaciones y montos; los formularios mantienen sus validaciones adicionales. Las claves públicas no sustituyen las políticas de acceso. Solo se envía la clave pública al navegador.

## Verificación

`npm test` incluye ejecución real del SQL con PostgreSQL embebido (PGlite), roles separados, permisos, reversión de guardados inválidos, conflictos de revisión, publicación sin datos internos y recepción limitada a servidor. Las tablas gestionadas por Supabase Auth/Storage se simulan en ese test. También se comprueba el endpoint de contacto con respuestas de Supabase simuladas.

Las verificaciones conectadas deben comprobar el inicio de sesión, el rol, la lectura autorizada y la persistencia de cambios. `node scripts/check-supabase.mjs` comprueba, de forma solo lectura, el catálogo público, el bloqueo de tablas privadas y el registro cerrado. `supabase/tests/live_smoke.sql` valida la recepción real de una solicitud dentro de una transacción que revierte íntegramente los registros y la revisión. La versión conectada y sus variables ya están desplegadas en `https://ksoftdev.vercel.app`. Se verificaron las respuestas HTTP públicas y el endpoint de contacto.

Documentación oficial consultada: [Auth](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage/security/access-control).

## Roles y uso del panel

Consulta [administracion.md](administracion.md) para publicar contenido y [equipo-y-tickets.md](equipo-y-tickets.md) para gestionar empleados, proyectos propios, asignaciones y tickets. Los permisos de desarrollador se filtran y validan en PostgreSQL. Las tablas `ksoft_developers` y `ksoft_assignments` no tienen acceso directo desde el navegador. Las pruebas cubren intentos de leer finanzas, publicar o cambiar campos que no pertenecen al desarrollador.
