# Panel de administración de Ksoft — frontend

La conexión opcional a Supabase está implementada. La activación, migración y diferencias frente al modo local se explican en [supabase.md](supabase.md). Las secciones siguientes describen el comportamiento local cuando no hay variables de Supabase configuradas.

Ejecuta `npm run dev` y abre `/dashboard`. Se mantiene el menú completo del panel. Los módulos funcionan en el navegador y comparten un estado persistente.

## Módulos
Cada sección sigue la estructura de Posts y Products: su página en `src/pages/Dashboards/<Módulo>/`, y su componente y CSS Module en `src/Components/dashboards/components/<Módulo>/`. Las páginas componen el encabezado y el gestor de su sección. El layout y el resumen también tienen sus propias carpetas de componentes. El formulario reutilizable de los registros se encuentra en `components/shared/BusinessManager/`; las reglas de datos y el estado no se duplican por módulo.

- Dashboard: indicadores calculados desde los registros, finanzas, tareas próximas y actividad.
- Pagos y gastos: crear, editar, eliminar, buscar, filtrar y exportar CSV. Los pagos pueden relacionarse con clientes y cotizaciones.
- Reportes: ingresos recibidos, gastos pagados, balance, pendientes y evolución mensual por período.
- Notificaciones: actividad y vencimientos; filtros y marcado de lectura.
- Publicaciones: borradores, contenido preparado, edición, eliminación y vista previa.
- Productos: copia inicial del catálogo público, edición comercial, preguntas y vista previa del producto elegido.
- Archivos: documentos o imágenes de hasta 500 KB, asociados opcionalmente a proyectos, con descarga.
- Proyectos y tareas: responsables, etapas, avance, entregables y fechas.
- Soporte: seguimiento de casos y resolución.
- Solicitudes: registro manual de consultas, cotizaciones e interés en el piloto, con producto y seguimiento. Permite asociar un contacto sin duplicar su correo; no recibe todavía el formulario público.
- Contactos y clientes: datos comerciales; conversión de un contacto en cliente sin duplicar su correo.
- Cotizaciones: estado, alcance, condiciones, impresión/PDF y creación de un proyecto a partir de una propuesta aceptada.
- Papelera: archivo recuperable de registros y fichas, restauración y eliminación definitiva con confirmación. No se vacía automáticamente.
- Historial: los últimos 100 cambios locales, con fecha, módulo y valores anteriores y nuevos; búsqueda, filtros y exportación JSON.
- Configuración: empresa, responsable, correo, exportación y restauración de respaldos.
- Salir del panel: vuelve a una pantalla de salida sin borrar registros; esta versión no simula autenticación.

## Persistencia y alcance
En Productos, «Editar ficha» permite preparar la tarjeta del catálogo, la tarjeta de inicio y el detalle: identidad, botones, público, modelo de cobro, problema, solución, beneficios, funcionalidades, portada, galería, secciones y preguntas. Los bloques de público, módulos, pasos, operación y comercial se pueden crear, editar, eliminar y ordenar. Las imágenes conservan título, texto alternativo, descripción y dimensiones; se pueden cargar PNG/JPG/WebP de hasta 500 KB o usar sus direcciones.

En Proyectos se conserva «Gestión interna» y se añade «Presentación pública», con fichas independientes para casos de clientes. Las fichas públicas no se crean automáticamente a partir de notas internas. Su información se guarda bajo `publicProjects` en el respaldo, sin alterar las tareas ni los proyectos operativos.

«Ver tarjeta y detalle» reutiliza los componentes públicos para mostrar tarjeta del catálogo, tarjeta de inicio y detalle completo (los proyectos muestran tarjeta y detalle). Los enlaces de contacto de la vista previa no envían solicitudes. El estado «Preparado» valida la información esencial; la visibilidad se conserva como un dato local, sin publicar online.

Las fichas antiguas de Dental y Travel incorporan los detalles y capturas actuales al cargarse, conservando los textos comerciales editados. Los bloques se centralizan en `src/config/productSections.ts` y los valores de presentación en `src/config/publicPresentation.ts`.

Todo se guarda en localStorage (`ksoft-admin-content-v1`) para el mismo navegador y origen. Las exportaciones JSON incluyen todos los módulos y los archivos. Al importar se valida la estructura y se pide confirmación antes de reemplazar la copia local. Si otra pestaña modifica los datos, se impide sobrescribir sus cambios y se indica que hay que recargar.

Los respaldos incluyen también la papelera y el historial. La configuración muestra su tamaño aproximado y permite recuperar un almacenamiento ilegible mediante un respaldo válido. Los respaldos anteriores sin solicitudes, papelera o historial siguen siendo compatibles.

Las acciones enlazan solicitud → contacto → cliente → cotización → proyecto → tarea o archivo, conservando las relaciones y abriendo los formularios con los datos asociados. Los detalles tienen enlaces directos a cada registro. Una cotización aceptada puede originar un único proyecto; la papelera también se comprueba para evitar duplicarlo.

Desde un cliente se puede crear una cotización, proyecto o caso de soporte. Desde una cotización se puede registrar un cobro con el valor todavía sin programar. Su detalle separa pagos recibidos, pendientes y saldo; los formularios impiden asignar cobros por encima del total o cambiar el cliente dejando relaciones incompatibles. Estos son registros administrativos, no transacciones de pago.

Enviar a la papelera permite deshacer inmediatamente. Se impide archivar un registro que todavía tiene dependencias activas; al restaurar se validan sus relaciones y posibles duplicados. El historial es una ayuda local, editable mediante el propio almacenamiento del navegador, no una auditoría de servidor.

Los formularios conservan los avisos de cambios sin guardar, campos obligatorios, errores y estados de lectura de archivos. Se revisan el foco al navegar, los controles por teclado y el menú en pantallas pequeñas.

En Configuración se enlaza `/dashboard/access`, una presentación del futuro acceso privado con campos etiquetados y opción de mostrar contraseña. Sin conectar un servicio de autenticación el botón está deshabilitado: no envía ni guarda credenciales, ni simula una sesión segura.

El estado «Preparado» es editorial. No publica contenido en las páginas públicas ni cambia la etapa comercial del producto. Los cobros, envíos y notificaciones del panel son registros locales, sin operaciones ni mensajes externos.

Las rutas administrativas están habilitadas en desarrollo y no se ofrecen en producción mientras se construye el frontend sin autenticación. No hay enlaces al panel en el menú público.

`/dashboard/proyects` redirige a `/dashboard/projects` para conservar la ruta antigua.

## Comprobaciones
`npm run build`, `npm run lint`, `npm test` y revisión en el navegador de los módulos, creación de registros, relaciones y persistencia.

