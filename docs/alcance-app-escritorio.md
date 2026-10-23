# Alcance de la aplicación de gestión de Ksoft

Versión de planificación 1.0 — 23 de octubre de 2026

## 1. Objetivo

Crear una aplicación de escritorio en Java para administrar el contenido, las relaciones comerciales y la operación de Ksoft Technology. El fundador será el administrador inicial. La arquitectura permitirá incorporar colaboradores con cuentas y permisos individuales.

Este documento define una propuesta de alcance y criterios de aceptación; no representa funcionalidades ya implementadas. El desarrollo se divide en entregas utilizables. La web pública React se conserva y el apartado de blog se implementará después de que la aplicación de escritorio y su servidor estén preparados.

## 2. Supuestos de partida

- Primera plataforma de escritorio: Windows, con instalador y runtime incluido para que el usuario no deba instalar un JDK.
- Aplicación interna para una empresa: Ksoft. No será un SaaS para administrar múltiples empresas en la primera versión.
- Primera versión con conexión a internet para consultar y guardar información. No se promete edición sin conexión ni sincronización de cambios offline.
- Servidor central alojado independientemente del computador del fundador. En desarrollo puede ejecutarse localmente; en producción debe seguir disponible con la app cerrada.
- La interfaz seguirá la identidad de la web: fondo oscuro, acentos azules, tipografía legible y estados claros.
- Idioma español, moneda inicial COP y fechas mostradas en America/Bogota. Los importes guardan moneda explícita; las fechas de eventos se almacenan con referencia temporal inequívoca.
- Se conserva el contenido real conocido: Ksoft, su fundador y SaaS Dental en acceso anticipado. No se agregan integrantes, clientes, funciones o resultados inventados.

## 3. Arquitectura propuesta

| Parte | Tecnología propuesta | Responsabilidad |
| --- | --- | --- |
| Aplicación instalada | Java y JavaFX | Pantallas, navegación, validación inmediata y comunicación con la API |
| Servidor central | Java y Spring Boot | Reglas de negocio, operaciones, datos, publicación e integraciones |
| Seguridad | Spring Security | Autenticación y permisos comprobados en el servidor |
| Datos | PostgreSQL | Usuarios, contactos, artículos, productos y registros operativos |
| Archivos | Almacenamiento de objetos | Imágenes y adjuntos; la base de datos conserva sus metadatos |
| Web pública | React existente | Mostrar contenido publicado y enviar consultas cuando se implemente la integración |
| Construcción | Maven, migraciones de base de datos y empaquetado de escritorio | Dependencias, cambios reproducibles e instalación |

Se propone un único servidor organizado por módulos. No se requieren microservicios ni Kubernetes. La aplicación de escritorio nunca se conecta directamente a la base de datos ni incluye sus credenciales. La web pública tampoco accede directamente a los datos privados.

El alojamiento, el dominio de la API, el almacenamiento y sus costes se definirán antes del despliegue, sin contrataciones automáticas. Las versiones concretas del JDK, JavaFX y Spring Boot se fijarán juntas al crear el proyecto, comprobando compatibilidad y mantenimiento.

## 4. Usuarios y permisos

| Rol | Alcance inicial |
| --- | --- |
| Propietario | Administración total, usuarios, permisos, publicaciones, clientes, importes y configuración |
| Desarrollador | Proyectos asignados, tareas, comentarios y archivos autorizados; sin acceso financiero ni gestión de usuarios por defecto |
| Editor | Artículos, imágenes y productos en borrador; no publica ni accede al CRM por defecto |

Solo se crea inicialmente la cuenta del propietario. Los otros roles preparan la incorporación futura de colaboradores; no afirman que ya existan empleados. El propietario puede disponer de permisos adicionales a través de funciones concretas, sin un editor genérico de roles en la primera entrega. Las nuevas cuentas se crean por invitación o administración, sin registro público.

Las reglas se aplican en la API, además de reflejarse en la interfaz. Toda operación de publicación y cambio de permisos queda auditada. Un usuario desactivado pierde acceso y sus registros históricos permanecen asociados a su identidad.

## 5. Módulos

### 5.1 Acceso y perfil

Inicio y cierre de sesión, cambio y recuperación de contraseña, perfil, desactivación de usuarios y revocación de sesiones. El primer usuario se provisiona con un procedimiento seguro y sin contraseñas predefinidas en el código. La sesión expira; los secretos persistentes se almacenan mediante mecanismos protegidos del sistema operativo. Se incluyen límites de intentos y segundo factor para el propietario en la salida a producción.

### 5.2 Inicio y pendientes

Resumen con consultas nuevas, seguimientos próximos, borradores y actividad reciente. Las tarjetas de cotizaciones, proyectos y saldos solo se incorporan cuando esos módulos existan. Los indicadores se calculan desde datos registrados; no se presentan métricas comerciales ficticias. Cada indicador lleva al listado correspondiente.

### 5.3 Consultas y oportunidades comerciales

Registro manual y, posteriormente, recepción desde el formulario público. Campos: nombre, empresa opcional, correo, teléfono opcional, motivo, mensaje, origen, fecha, responsable y notas internas. Estados: nueva, en revisión, contactada, en seguimiento y cerrada. Una oportunidad registra el interés comercial y puede vincularse a una cotización sin convertir automáticamente todo contacto en cliente.

Lista con búsqueda, filtros, próximos seguimientos y detección básica de coincidencias por correo. No fusionar automáticamente personas ni eliminar consultas duplicadas sin revisión. Capturar un contacto desde la web no crea una cuenta de acceso.

### 5.4 Clientes

Ficha de empresa o persona con contactos, notas, oportunidades y, al habilitar los módulos posteriores, cotizaciones, proyectos y pagos relacionados. Convertir un prospecto en cliente es una acción explícita. El identificador fiscal es opcional y se solicita solo cuando el proceso comercial lo necesite. No habrá portal de clientes en la primera versión.

### 5.5 Publicaciones y biblioteca de imágenes

Artículos, novedades y casos de proyecto como tipos de contenido. Campos: título, identificador de URL único, extracto, cuerpo, imagen de portada, texto alternativo, categoría, autor público y metadatos de buscadores. Guardar con contenido estructurado o formato limitado; no permitir HTML arbitrario sin sanitización.

Estados: borrador, publicado y archivado. Conservar una versión publicada separada de los cambios pendientes para que editar un artículo no altere inmediatamente la web. Acciones: guardar, previsualizar en escritorio, publicar, retirar de publicación y archivar. La programación por fecha y las revisiones editoriales con varios aprobadores quedan para una ampliación.

Durante la entrega de escritorio se comprueba el flujo mediante la API, sin crear todavía el blog React. Los endpoints públicos solo devuelven versiones publicadas; borradores, datos internos y archivos privados no pueden consultarse de forma anónima. La vista previa de escritorio sirve para revisar el contenido; la vista previa fiel del sitio llegará con la integración React.

La biblioteca permite subir imágenes con tipos y tamaño limitados, descripción alternativa y comprobación de uso antes de retirarlas. Las imágenes públicas y los adjuntos privados tienen políticas de acceso distintas.

### 5.6 Catálogo de productos SaaS

Administrar nombre, descripción, sector, estado, enlace, imágenes y funciones confirmadas. Estados comerciales: en preparación, acceso anticipado, disponible y retirado. Mantener información pública separada de notas internas. Permitir relacionar consultas con un producto. Los planes visibles serán informativos cuando se definan, sin cobros recurrentes automáticos en esta etapa.

Este módulo gestiona la oferta comercial de Ksoft. No administra historias clínicas, pacientes, datos de clínicas, permisos internos ni las bases de datos de SaaS Dental. Una futura integración con cada SaaS requerirá un alcance y permisos independientes.

### 5.7 Cotizaciones

Cliente u oportunidad, número, versión, descripción, conceptos, cantidades, precios, moneda, descuentos, condiciones, vigencia, alcance, exclusiones y calendario de pagos. Estados: borrador, preparada para enviar, enviada, aceptada, rechazada, vencida y cancelada. Exportar PDF con identidad de Ksoft. Marcar como enviada es una acción manual; el sistema no envía correos ni mensajes sin una función y autorización explícitas.

Registrar fecha y evidencia de aceptación, sin confundir el cambio de estado con una firma electrónica. Las cotizaciones enviadas o aceptadas se conservan como versiones inmutables. Los cambios posteriores generan una nueva versión. Las condiciones del documento comercial serán configurables; no se aplican como reglas legales universales a cualquier tipo de venta. El seguimiento de anticipo y saldo se usa para proyectos a medida, separado del modelo de suscripción de los SaaS.

### 5.8 Proyectos y tareas

Crear proyecto desde una cotización aceptada o manualmente, sin duplicados por repetir la acción. Campos: cliente, responsable, alcance aprobado, fechas estimadas, hitos, estado, notas y adjuntos. Estados: pendiente de inicio, activo, pausado, en revisión, entregado y cancelado. El inicio se confirma manualmente después de revisar los requisitos y el anticipo acordado.

Tareas con responsable, prioridad, vencimiento, comentarios y estados pendiente, en curso, en revisión y completada. Mostrar tablero y listado. Cambiar una fecha o alcance relevante deja historial. Solicitudes de cambio registran descripción, impacto, presupuesto y aprobación; no modifican silenciosamente una cotización aceptada. Los colaboradores solo consultan los proyectos autorizados.

### 5.9 Seguimiento financiero operativo

Registrar cobros, pagos recibidos, gastos, fechas, categorías, moneda, comprobantes y vínculo con cliente o proyecto. Mostrar anticipos, saldos y vencimientos calculados. Los presupuestos de cotizaciones no se contabilizan como dinero recibido. Separar ingresos cobrados de importes pendientes y evitar sumar monedas diferentes.

Las correcciones se registran mediante ajustes y trazabilidad. Este módulo es control interno: no sustituye contabilidad, conciliación bancaria, facturación electrónica, nómina ni declaraciones tributarias. No recoge claves bancarias ni realiza transferencias.

### 5.10 Soporte

Solicitudes asociadas a un cliente, proyecto o producto, con prioridad, responsable, notas, archivos y estados abierta, en atención, pendiente del cliente y resuelta. Inicialmente se registran manualmente; un portal externo o integración con correo se considera posterior. No se promete atención 24/7 ni tiempos contractuales de resolución por defecto.

### 5.11 Documentos

Organizar propuestas, contratos y comprobantes vinculados a registros del negocio. Campos: tipo, versión, propietario, acceso y fecha. Archivos privados solo mediante autorización. Conservar histórico y límites de carga. Firma electrónica y generación automática de documentos legales complejos quedan fuera de la primera versión.

### 5.12 Configuración, actividad y reportes

Datos de Ksoft, canales de atención, moneda, condiciones comerciales predeterminadas, usuarios y preferencias. Registro de autor, fecha y operación para publicaciones, permisos, cotizaciones, cambios de proyecto y movimientos financieros. No registrar contraseñas, tokens ni cuerpos completos de mensajes en los logs.

Reportes y exportación CSV de datos autorizados: consultas por estado y origen; cotizaciones por resultado; proyectos por estado; cobros pendientes. Incorporarlos conforme existan sus módulos. Las copias de seguridad se ejecutan en infraestructura y se muestran en la app mediante su estado; un usuario no recibe acceso directo a credenciales de infraestructura.

## 6. Navegación

Menú lateral: Inicio; Consultas; Clientes; Publicaciones; Productos SaaS; Cotizaciones; Proyectos; Finanzas; Soporte; Documentos; Configuración. Mostrar solo módulos implementados y permitidos. Perfil, sesión y conectividad accesibles desde la barra superior. No mostrar botones de funciones futuras que aparenten estar disponibles.

Pantallas con búsqueda, filtros, paginación, acciones claras y confirmaciones proporcionales. Diferenciar listas vacías de errores de conexión. Las operaciones de red no bloquean la interfaz JavaFX. Se advierte antes de abandonar cambios sin guardar. El archivado es el mecanismo normal de retirada; el borrado definitivo y las obligaciones de conservación o eliminación de datos se definirán por tipo de registro.

## 7. Relaciones y flujos

Flujo comercial: consulta → oportunidad → cotización versionada → aceptación registrada → cliente/proyecto → tareas y entregas → cobros y soporte.

Flujo editorial: contenido → borrador → vista previa → publicación autorizada → API pública → web React cuando se construya el blog. Editar un publicado crea cambios pendientes; retirar la publicación impide nuevas lecturas públicas y debe invalidar las cachés al integrar la web.

Flujo SaaS: producto → consulta comercial → seguimiento → condiciones de acceso. La activación real de una cuenta en SaaS Dental no se automatiza sin una integración explícita.

Entidades principales: usuario, rol, permiso, consulta, contacto, cliente, oportunidad, seguimiento, contenido, revisión de contenido, archivo, producto, cotización, versión de cotización, concepto, proyecto, hito, tarea, cambio de alcance, movimiento financiero, solicitud de soporte y evento de auditoría. No todas se implementan en la primera entrega.

## 8. Entregas propuestas

| Entrega | Alcance | Resultado comprobable |
| --- | --- | --- |
| 0 Base técnica | JavaFX, servidor, base de datos, migraciones, inicio de sesión, permisos, empaquetado y manejo de errores | App instalada que inicia sesión y guarda datos contra el servidor |
| 1 Gestión inicial | Inicio básico, consultas manuales, clientes básicos, publicaciones, biblioteca pública, catálogo SaaS y configuración | El propietario administra registros y prueba publicación y retirada mediante la API |
| 2 Web conectada | Blog React, detalle de artículo, lectura del catálogo, formulario hacia Java y protección del punto de entrada | Lo publicado aparece en la web y las consultas llegan a escritorio con el PC cerrado |
| 3 Operación comercial | Cotizaciones PDF, proyectos, tareas, cambios de alcance y acceso del colaborador | Una oportunidad puede gestionarse hasta un proyecto con tareas asignadas |
| 4 Control operativo | Cobros y gastos, soporte, documentos privados y reportes | Seguimiento de saldos y operación, sin sustituir sistemas contables |

La entrega 2 comienza después de preparar y validar la aplicación Java, respetando el orden acordado. Hasta conectar el formulario público, las consultas del servidor Java se registran manualmente; el mecanismo de Google existente no alimenta por sí solo la nueva base de datos.

## 9. Requisitos para salida a producción

- HTTPS, autenticación y permisos de API verificados por recurso y operación. Ninguna clave privada dentro de la app o el frontend público.
- Recuperación y revocación de acceso probadas; segundo factor para el propietario.
- Migraciones de datos repetibles, entornos de desarrollo y producción separados y datos de prueba ficticios.
- Copia diaria automatizada de base de datos y archivos, con procedimiento de restauración probado. Objetivo inicial propuesto de pérdida máxima de 24 horas, sujeto a la solución de alojamiento.
- Validación del servidor, límites de peticiones y de archivos, protección del formulario público y controles contra publicación de contenido peligroso.
- Operaciones sensibles auditadas. Control de versiones de registros para detectar cambios simultáneos y no sobrescribirlos silenciosamente.
- Instalador con runtime incluido, número de versión y procedimiento de actualización. Automatizar actualizaciones y firmar el instalador requieren preparar distribución y certificados, no se presuponen disponibles.
- Indicadores de carga, error y conectividad; mensajes sin falsa confirmación de guardado. Reintentos no deben duplicar publicaciones, proyectos ni movimientos.
- Pruebas de permisos, publicación y retirada, validación, importes, conflictos y flujos principales; revisión visual y de teclado de la app instalada.

## 10. Fuera del alcance inicial

Aplicaciones móviles, operación offline, sincronización automática, múltiples empresas, portal de clientes, chat propio, campañas masivas, automatización de WhatsApp, cobros recurrentes, pasarelas de pago, facturación electrónica, contabilidad fiscal, nómina, firma electrónica e integración con los datos clínicos de los SaaS.

Editar desde el panel toda la estructura visual de la web como un constructor de páginas tampoco forma parte de la primera versión. La app administrará contenido y campos definidos; un cambio de diseño seguirá siendo una modificación del frontend.

## 11. Criterios de aceptación de la gestión inicial

1. El propietario instala y abre la app en Windows sin instalar herramientas de desarrollo.
2. Puede iniciar y cerrar sesión; una sesión revocada ya no accede a la API.
3. Puede registrar, buscar, actualizar y archivar una consulta y un cliente.
4. Puede crear y editar un artículo con portada, guardar borrador y revisar su contenido.
5. Un borrador nunca aparece en la API pública. Publicar lo hace visible; retirar la publicación deja de exponerlo.
6. Editar un artículo publicado no cambia su versión pública hasta una nueva publicación.
7. Puede administrar la ficha de SaaS Dental con datos confirmados y estado de acceso anticipado.
8. Un usuario sin permiso no accede a datos restringidos aunque invoque la API directamente.
9. Un error de conexión conserva los datos del formulario y no muestra éxito; no se guardan duplicados al repetir una operación.
10. Puede restaurarse una copia de prueba de los datos y archivos. Se conoce qué se recupera y desde qué fecha.

## 12. Decisiones pendientes antes de construir

Nombre definitivo de la aplicación; versiones compatibles del stack; alojamiento y presupuesto; proveedor de correo para recuperación; segundo factor; almacenamiento; política de conservación y eliminación; límites de imágenes y archivos; condiciones comerciales definitivas y procedimiento de distribución del instalador.

Estas decisiones no impiden comenzar el diseño de pantallas, el modelo de datos y la estructura técnica local. No se fija una fecha de entrega sin estimar cada módulo y su validación. La posible incorporación del amigo como desarrollador no concede permisos ni inicia invitaciones automáticamente.

## 13. Nombres técnicos de los módulos

Estos nombres identifican módulos del servidor Java y sirven como referencia para organizar las pantallas de escritorio. La interfaz mostrará los nombres en español. Son una estructura propuesta; no se crean carpetas ni se implementan todos los módulos en la primera entrega.

| Módulo técnico | Nombre en la aplicación | Responsabilidad |
| --- | --- | --- |
| `auth` | Acceso y seguridad | Inicio y cierre de sesión, recuperación de contraseña, segundo factor y revocación de sesiones |
| `users` | Usuarios y permisos | Cuentas del propietario y colaboradores, perfiles, roles y desactivación de usuarios |
| `dashboard` | Inicio | Resumen de consultas, borradores, pendientes y actividad permitida al usuario |
| `contacts` | Consultas y seguimiento | Personas interesadas, mensajes recibidos, oportunidades, notas y próximos seguimientos |
| `clients` | Clientes | Ficha de clientes y sus contactos; relación con cotizaciones, proyectos y pagos |
| `posts` | Publicaciones | Artículos, novedades y casos de proyectos; borradores, revisiones y publicación |
| `products` | Productos SaaS | Oferta comercial, fichas públicas, disponibilidad y condiciones informativas de los productos propios |
| `quotes` | Cotizaciones | Propuestas comerciales, conceptos, importes, alcance, versiones, aceptación registrada y exportación PDF |
| `projects` | Proyectos | Alcance aprobado, responsables, hitos, entregas y solicitudes de cambio |
| `tasks` | Tareas | Trabajo pendiente por proyecto, responsables, prioridades, comentarios y estados |
| `payments` | Cobros y pagos recibidos | Anticipos y pagos de clientes, comprobantes y cálculo de saldos; no ejecuta transferencias ni cobra automáticamente |
| `expenses` | Gastos | Gastos operativos, categorías y comprobantes; separado de los pagos recibidos |
| `support` | Soporte | Solicitudes de ayuda de clientes y seguimiento de su atención |
| `files` | Archivos y documentos | Imágenes públicas y documentos privados, metadatos y permisos por archivo; su visibilidad no se mezcla |
| `notifications` | Avisos y recordatorios | Avisos internos de consultas, asignaciones y seguimientos; no implica correo o WhatsApp automáticos |
| `reports` | Reportes | Consultas y exportaciones de resultados comerciales y operativos, según permisos |
| `settings` | Configuración | Datos de Ksoft, canales, preferencias y condiciones comerciales predeterminadas |
| `audit` | Historial de actividad | Registro de quién hizo una operación, cuándo y sobre qué registro |
| `publicapi` | Conexión con la web | Endpoints de lectura de contenido publicado y entrada de consultas públicas; no contiene las reglas de negocio de los demás módulos |

`dashboard` y `reports` consultan los datos de los módulos responsables, sin duplicar sus registros. `publicapi` delega en `posts`, `products` y `contacts`; no permite consultar clientes, finanzas ni borradores. `files` controla acceso, mientras cada módulo de negocio conserva las relaciones con sus adjuntos. `auth` comprueba identidad y sesión; `users` administra cuentas y permisos.

En Java se utilizarán paquetes en minúsculas y sin guiones; por eso se propone `publicapi`. Los nombres de endpoints HTTP pueden definirse por separado. No se incluyen módulos propios del ejemplo de hoteles, como reservas o habitaciones, porque no corresponden a la operación de Ksoft.

La secuencia de entregas de la sección 8 sigue vigente. Los módulos se crean cuando comienza su implementación; los avisos de tareas, finanzas y soporte se incorporan junto con sus funciones correspondientes.

## 14. Referencias técnicas

- JavaFX para la interfaz de escritorio: https://openjfx.io/
- API REST con Spring: https://spring.io/guides/gs/rest-service/
- Autorización en Spring Security: https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html
