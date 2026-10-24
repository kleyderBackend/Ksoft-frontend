# Equipo y tickets internos

El administrador mantiene todas las opciones anteriores del panel. Las nuevas secciones son **Equipo**, **Tickets internos** y **Mi perfil**.

## Cuentas

En Equipo → Crear empleado, introduce nombre, correo y rol. Se crea una cuenta individual con una contraseña aleatoria; aparece una sola vez y se puede copiar. No se envía correo ni se guarda la contraseña en los registros del dashboard. La persona puede cambiarla desde Mi perfil.

El correo debe ser nuevo. Crear empleado no restablece contraseñas de cuentas existentes ni otorga administración. Las cuentas administradoras están protegidas frente a cambios en este módulo.

| Rol | Permisos |
| --- | --- |
| Administrador | Contenido público, operaciones comerciales, finanzas, equipo, asignaciones y todos los tickets internos. |
| Development | Consultar proyectos asignados y actualizar su avance; actualizar estados y notas de tareas asignadas; tickets y perfil. |
| QA | Consultar proyectos asignados sin modificar su avance; actualizar estados y notas de tareas asignadas; tickets y perfil. |
| Empleado | Tickets y perfil. No accede a proyectos, contenido ni información comercial. |

Desde Proyectos/Tareas → Asignar equipo de trabajo se seleccionan desarrolladores y QA. Para asignar una tarea, primero debe existir asignación al proyecto correspondiente.

Suspender una cuenta o cambiarla a Empleado retira sus asignaciones. Se conserva su historial de tickets; al reactivar la cuenta, las asignaciones deben establecerse de nuevo. Todas las operaciones consultan el acceso vigente en el servidor.

## Tickets

Cada ticket tiene asunto, descripción, tipo, prioridad y responsable. Permite conversar, cambiar estado y reasignar a otro miembro activo. Los tipos son Consulta, Error, Bloqueo y Mejora; para un error, describe los pasos, el resultado esperado y el resultado observado.

Administración ve todos los tickets. Cada empleado ve únicamente los que creó o tiene asignados. El responsable o administración pueden cambiar cualquier estado y reasignar. Quien creó el ticket puede comentar, cerrarlo o reabrirlo. Las respuestas y cambios de estado o responsable quedan en la conversación. Los tickets no se publican en la web ni envían correos.

El indicador de mensajes sin leer se actualiza al abrir la conversación, recuperar el foco o cada minuto. La lista permite buscar, filtrar por estado y paginar. Usa Actualizar tickets para consultar nuevas respuestas en una conversación abierta.

## Implementación y comprobación

Migraciones `202610240005_team_and_tickets.sql` y `202610240006_work_roles.sql`. Tablas privadas con RLS; lectura y escritura mediante funciones que comprueban identidad y permisos. La clave de servicio solo se utiliza en `/api/team`, nunca en el navegador.

La API de creación valida la sesión administradora antes de crear un usuario. Si el registro del rol falla de forma confirmada, elimina únicamente la cuenta que acaba de crear. Si hay una interrupción de red después de crear la cuenta, avisa de que se debe actualizar el equipo antes de reintentar.

Las pruebas de PostgreSQL cubren aislamiento de tickets, rechazo de escalamiento de privilegios, QA, empleados y suspensión. `supabase/tests/live_team_smoke.sql` comprueba el flujo real dentro de una transacción que revierte los datos de prueba.
