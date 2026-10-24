export interface Project {
  slug: string;
  name: string;
  category: string;
  status: string;
  sector: string;
  logo?: string;
  buttonText?: string;
  icon?: string;
  cover?: { src: string; title: string; alt: string; caption: string; width: number; height: number };
  galleryEyebrow?: string;
  galleryPanelLabel?: string;
  summary: string;
  challenge: string;
  solution: string;
  benefit: string;
  features: string[];
  galleryTitle?: string;
  galleryIntro?: string;
  images: { src: string; title: string; alt: string; caption: string; width: number; height: number }[];
  href?: string;
}

export const projects: Project[] = [
  {
    slug: "ksoft-travel",
    name: "Ksoft Travel",
    category: "Solución para turismo",
    status: "Preparación de piloto",
    sector: "Turismo, hoteles y guías",
    logo: "/img/projects/ksoft-travel-logo.png",
    summary: "Una plataforma turística que conecta viajeros, hoteles y guías con reservas, disponibilidad y herramientas de gestión. Producto propio en preparación para un piloto.",
    challenge: "Conectar la búsqueda del viajero con la operación de hoteles y guías, manteniendo el seguimiento de disponibilidad, reservas, comunicación y pagos en una misma plataforma.",
    solution: "Un portal público para explorar hoteles y guías, conectado a paneles para turistas, proveedores y administración. Cada rol dispone de herramientas para gestionar su parte del recorrido de la reserva.",
    benefit: "Presenta tu oferta turística, organiza tus reservas y mantén la comunicación con tus viajeros desde un mismo lugar.",
    features: ["Catálogo público de hoteles y guías con páginas de detalle.", "Reservas de habitaciones y servicios turísticos con consulta de disponibilidad.", "Panel del viajero con perfil, reservas y reseñas.", "Paneles para hoteles y guías con gestión de oferta, reservas y reportes.", "Chat y notificaciones para acompañar la operación.", "Administración de usuarios, proveedores, verificaciones, soporte y disputas."],
    galleryTitle: "Conoce el panel de tu hotel",
    galleryIntro: "Explora las vistas de Ksoft Travel para hoteles: desde el resumen de la operación hasta la gestión de habitaciones y disponibilidad. Las cifras y políticas visibles en las capturas no representan una oferta comercial.",
    images: [
      { src: "/img/projects/travel-hotel-resumen.png", title: "Resumen del hotel", alt: "Panel del hotel en Ksoft Travel con reservas activas, ventas y ocupación", caption: "Revisa las reservas activas, las ventas recientes y la ocupación desde el resumen de tu hotel.", width: 1600, height: 813 },
      { src: "/img/projects/travel-hotel-habitaciones.png", title: "Habitaciones", alt: "Gestión de habitaciones del hotel con categorías, capacidad, precio y disponibilidad", caption: "Organiza tu inventario de habitaciones y consulta su tipo, capacidad, precio y estado.", width: 1600, height: 817 },
      { src: "/img/projects/travel-hotel-disponibilidad.png", title: "Disponibilidad", alt: "Calendario mensual de disponibilidad de habitaciones en el panel hotel de Ksoft Travel", caption: "Consulta la disponibilidad por fecha y habitación para planificar la ocupación de tu hotel.", width: 1600, height: 814 },
      { src: "/img/projects/travel-hotel-facturacion.png", title: "Facturación", alt: "Vista de facturación del hotel con balance, comisiones y movimientos de reservas", caption: "Da seguimiento al balance, las comisiones y los movimientos asociados a las reservas.", width: 1600, height: 814 },
      { src: "/img/projects/travel-hotel-configuracion.png", title: "Condiciones del hotel", alt: "Configuración de políticas de cancelación y reembolso del hotel en Ksoft Travel", caption: "Gestiona las condiciones de cancelación y reembolso que aplican a las reservas de tu hotel.", width: 1600, height: 814 },
    ],
  },
  {
    slug: "saas-dental",
    name: "SaaS Dental",
    category: "Solución para consultorios odontológicos",
    status: "Preparación de piloto",
    sector: "Clínicas dentales",
    summary: "Organiza tus pacientes y citas, y facilita la confirmación de asistencia por correo. Una solución para consultorios odontológicos en preparación de piloto, a la espera de sus primeros usuarios.",
    challenge: "Organizar la información de pacientes y la agenda de consultorios odontológicos privados, y dar seguimiento a la asistencia para abordar los espacios que dejan las citas no atendidas.",
    solution: "Reúne la información de tu consultorio y su agenda, con recordatorios por correo 24 horas antes de la cita y enlaces para que el paciente confirme o rechace su asistencia.",
    benefit: "Consulta la información de tus pacientes, sigue el estado de las citas y dedica menos tiempo a organizar la agenda del consultorio.",
    features: [],
    images: [],
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
