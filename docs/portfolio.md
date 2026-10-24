# Catálogo público y solicitudes de piloto

Las rutas públicas son `/products` y `/products/:slug`. Productos reúne el catálogo y las fichas de Dental y Travel. Portafolio se reserva para futuros casos de clientes y no se muestra en la navegación. Las direcciones anteriores `/portfolio` y `/portfolio/:slug` redirigen a Productos para conservar enlaces existentes. Los datos iniciales de referencia se definen en `src/config/projects.ts` y `src/config/products.ts`. El contenido publicado en Supabase permite actualizar las fichas desde el dashboard.

## Solicitudes de piloto

Cada producto enlaza a `/contact?producto=<slug>&motivo=piloto#contact-form`. El formulario valida el identificador contra el catálogo, muestra el producto elegido y conserva la selección en la URL al cambiarla o recargar. Requiere nombre y correo; el mensaje de contexto es opcional. El propósito y el producto se incluyen en el mensaje enviado a `/api/contact`, incluso si no hay contexto adicional. La respuesta confirmada del proveedor conserva el criterio de éxito existente. No supone admisión automática al piloto ni ejecuta un cobro.

Las consultas generales siguen disponibles desde Contacto. Al seleccionar Producto SaaS se pide elegir el producto. Los enlaces y los selectores no incluyen datos personales en la URL. El correo y el nombre no se guardan en el navegador tras recargar.

Cada ficha muestra preguntas sobre participación, funciones, cobro y acompañamiento. Solo se afirman los modelos confirmados: planes de suscripción para Dental y comisión para Travel. Precios, porcentajes, límites y alcance del soporte se consultan con Ksoft antes de comenzar.

## Enfoque comercial

La web pública está dirigida a compradores. Las fichas presentan público objetivo, necesidades, beneficios, funciones y disponibilidad, con una llamada a contactar con Ksoft. No mostrar stacks, frameworks, arquitectura, procesos internos de desarrollo, pagos simulados ni hojas de ruta técnicas. La documentación técnica se utiliza para verificar el contenido y permanece como referencia interna. Mantener visibles las condiciones de disponibilidad sin ofrecer como disponibles funciones futuras.

Para añadir un producto, crear su ficha en Productos desde el dashboard, con un `slug` único, nombre, categoría, estado, sector, resumen, necesidad, solución y beneficio para el comprador. Añadir únicamente funcionalidades verificadas. `images` contiene rutas públicas, textos alternativos y pies de imagen; `href` es opcional. El listado, la vista previa del inicio, las fichas y los metadatos usan los mismos registros.

Ksoft Travel sustituye el caso de la web corporativa. La ficha se basa en los README de frontend/backend y el estado del piloto del repositorio local TravelGo. Presenta turistas, hoteles, guías, reservas, comunicación y administración; su estado es preparación de piloto, sin atribuirle un despliegue remoto ni resultados operativos. El logo PNG se extrajo del `travel-go/public/favicon.ico` proporcionado por el propietario. No es una captura de interfaz.

La ficha de Travel incorpora cinco capturas proporcionadas por el propietario: resumen, habitaciones, disponibilidad, facturación y configuración. Todas corresponden al panel hotel, no a las vistas de guías, viajeros o administración de Ksoft. La galería permite seleccionar cada vista y abrir el archivo completo. Se conserva la imagen sin recortar y con sus proporciones originales. Las cifras y políticas visibles no se trasladan a las tarifas generales ni a las condiciones del piloto. La presentación se modifica en la web corporativa; no se altera el dashboard funcional de TravelGo.

SaaS Dental se presenta en preparación de piloto, a la espera de sus primeros usuarios, según la actualización del propietario. No hay enlace público de acceso ni capturas de interfaz. Su detalle público está en `src/config/dental.ts`, basado en el documento proporcionado por el propietario, `DOCUMENTACION KSOFT DENTAL V1.docx`. Presenta pacientes, agenda, gestión del consultorio y confirmación por correo. Los pagos simulados, arquitectura y futuras funciones descritas en el documento no forman parte del argumento comercial público. No atribuir precios, fechas ni resultados no documentados.

El catálogo se administra actualmente desde el dashboard privado: permite editar las fichas, cargar imágenes, revisar vistas previas y publicar cambios. Los archivos de configuración del repositorio conservan el catálogo inicial de referencia. Consulta [administracion.md](administracion.md) para el flujo de publicación.

Comprobaciones: catálogo y ambas fichas, redirecciones antiguas, solicitud y cambio de producto, selección tras recarga, consulta general, campos obligatorios, preguntas comerciales en móvil y `noindex` en una ficha inexistente. Ejecutar `npm run build`, `npm run lint` y `npm test` antes de publicar. Las pruebas simulan la recepción del proveedor; no acreditan recepción real ni envían solicitudes a Google.
