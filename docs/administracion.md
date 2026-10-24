# Administración y desarrollo

Los accesos solicitados están en `credenciales-ksoft.local`. Ese archivo está excluido de Git y de los despliegues de Vercel. No hay contraseñas en los componentes ni en las variables públicas.

## Publicar contenido

1. Entra al dashboard con la cuenta administradora.
2. Abre Publicaciones, Productos o Proyectos → Presentación pública.
3. Completa la tarjeta, el texto, las imágenes y los detalles. Puedes cargar PNG/JPG/WebP desde tu equipo.
4. Usa **Publicar en la web**. El guardado y la publicación se realizan en una misma transacción: si no se puede publicar, el formulario conserva tus cambios.
5. Usa **Guardar borrador** si todavía no quieres cambiar lo que ve el público. Una versión pública anterior se conserva hasta que publiques la nueva o la retires.

**Retirar de la web** conserva la ficha privada y quita su versión pública. Enviar una ficha a la papelera también la retira del catálogo público. Configuración conserva el botón de publicación conjunta de todas las fichas preparadas, con su confirmación.

Los productos aparecen en `/products` y tienen detalle propio. Las publicaciones aparecen en el inicio y en `/novedades`, con páginas en `/novedades/:slug`. Las nuevas publicaciones no necesitan un nuevo despliegue de código: la web lee el contenido publicado en Supabase.

## Asignar trabajo

1. Crea o guarda un proyecto en Proyectos → Gestión interna.
2. Pulsa **Asignar desarrolladores**, selecciona la cuenta y guarda la asignación.
3. Crea las tareas y relaciónalas con ese proyecto.
4. Asigna cada tarea al desarrollador. La base exige que tenga también acceso al proyecto.
5. El desarrollador puede usar **Actualizar registros** para consultar asignaciones recientes.

## Permisos

| Acción | Administrador | Desarrollador |
| --- | --- | --- |
| Gestionar contenido y publicar | Sí | No |
| Clientes, solicitudes y finanzas | Sí | No |
| Crear, archivar o restaurar registros | Sí | No |
| Asignar proyectos y tareas | Sí | No |
| Consultar alcance y fechas de sus proyectos | Sí | Solo asignados |
| Actualizar el avance de un proyecto | Sí | Solo asignados |
| Actualizar estado y notas de una tarea | Sí | Solo tareas asignadas dentro de sus proyectos |
| Cambiar alcance, fechas y prioridades | Sí | No |
| Consultar archivos, notas comerciales o cotizaciones | Sí | No |

Los permisos se comprueban en PostgreSQL, además de limitar las pantallas del dashboard. Cambiar la interfaz, una URL o el JSON de una petición no convierte al desarrollador en administrador.

La cuenta que antes era administradora pasó a desarrollador después de crear y verificar el nuevo acceso administrativo. No se crearon las direcciones descartadas durante la conversación.

## Despliegue

Vercel utiliza `npm ci` y `npm run build`. Las variables públicas identifican el proyecto; `SUPABASE_SERVICE_ROLE_KEY` se almacena como secreto del servidor. Las credenciales personales, archivos `.local`, `.env*`, migraciones y pruebas no forman parte del despliegue.
