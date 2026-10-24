import { dentalProduct } from "./dental.ts";
export interface DetailSection {
  id: string; type: "audience" | "modules" | "flow" | "architecture" | "commercial";
  eyebrow: string; title: string; description: string; paragraphs: string[];
  items: {title: string; description: string}[]; flowLabels: string[];
}
const section = (id: string, type: DetailSection["type"], eyebrow: string, title: string, description = "", items: DetailSection["items"] = [], paragraphs: string[] = [], flowLabels: string[] = []): DetailSection => ({id,type,eyebrow,title,description,items,paragraphs,flowLabels});
export const productSections: Record<string, DetailSection[]> = {
  "saas-dental": [
    section("dental-audience","audience","PENSADO PARA TU CONSULTORIO","Pacientes, agenda y comunicación en un mismo lugar","El producto busca facilitar el trabajo diario del consultorio, dar más visibilidad a las citas y sus confirmaciones, y ayudar a reducir los espacios perdidos por inasistencia.", dentalProduct.audience.map(title => ({title,description:""}))),
    section("dental-modules","modules","FUNCIONES PARA TU CONSULTORIO","Organiza tu atención desde un solo lugar","Conoce sus funciones y consulta cómo participar en el piloto de Ksoft Dental.",dentalProduct.modules.map(({title,description}) => ({title,description}))),
    section("dental-flow","flow","DE LA CITA A LA CONFIRMACIÓN","Una agenda con seguimiento de asistencia","La primera automatización conecta la programación de la cita con la respuesta del paciente por correo.",dentalProduct.appointmentFlow,[],["Paciente","Cita","Confirmación"]),
    section("dental-commercial","commercial","PLANES DE SUSCRIPCIÓN","Prepara tu consultorio para el piloto","",[],["Ksoft Dental se ofrece mediante planes de suscripción. Cuéntanos cómo organizas hoy tus pacientes y tu agenda para orientarte sobre el plan y las funciones que necesita tu consultorio.","Estamos preparando el piloto y esperamos a sus primeros usuarios. Consulta con Ksoft cómo participar, los precios y las condiciones de cada plan."]),
  ],
  "ksoft-travel": [
    section("travel-audience","audience","TURISMO CONECTADO","Del descubrimiento del destino a la gestión de la reserva","Ksoft Travel reúne la experiencia del viajero y las herramientas que hoteles y guías necesitan para presentar y gestionar su oferta. Cada participante tiene un espacio según su rol.",["Viajeros que buscan alojamiento y experiencias","Hoteles que gestionan habitaciones y reservas","Guías que ofrecen servicios turísticos"].map(title => ({title,description:""}))),
    section("travel-roles","modules","PARA QUIEN VIAJA Y QUIEN RECIBE","Una solución para cada participante","Encuentra alojamiento y experiencias, o presenta y gestiona tu oferta turística.",[
      {title:"Viajeros",description:"Exploran hoteles y guías, consultan la oferta, realizan reservas y gestionan su perfil y reseñas."},
      {title:"Hoteles",description:"Administran su perfil, habitaciones, disponibilidad y reservas, con reportes y seguimiento de reseñas."},
      {title:"Guías turísticos",description:"Presentan su perfil profesional y sus servicios, y gestionan reservas, reportes y reseñas."},
    ]),
    section("travel-journey","flow","EL RECORRIDO DE UNA RESERVA","Explorar, reservar y dar seguimiento","",[
      {title:"Explorar la oferta",description:"El viajero consulta el catálogo público y el detalle del hotel o guía que le interesa."},
      {title:"Solicitar una reserva",description:"Selecciona habitación o servicio y revisa disponibilidad y condiciones del proveedor."},
      {title:"Revisar las condiciones",description:"Consulta la modalidad de pago y las condiciones de la reserva antes de continuar."},
      {title:"Gestionar la experiencia",description:"Viajero y proveedor consultan la reserva y cuentan con comunicación, notificaciones y seguimiento desde sus paneles."},
    ]),
    section("travel-operation","architecture","OPERACIÓN Y COMUNICACIÓN","Más que un catálogo turístico","",[
      {title:"Oferta y disponibilidad",description:"Los proveedores gestionan habitaciones o servicios, sus reservas y la disponibilidad de su oferta."},
      {title:"Comunicación y reseñas",description:"Chat, notificaciones y reseñas con respuesta del proveedor acompañan la relación con el viajero."},
      {title:"Control de la operación",description:"Reportes y herramientas de administración permiten seguir reservas, incidencias y movimientos de la plataforma."},
    ]),
    section("travel-status","commercial","MODELO DE COMISIÓN","¿Tienes un hotel u ofreces experiencias turísticas?","",[],["Cuéntanos sobre tu negocio y conoce cómo Ksoft Travel puede ayudarte a presentar tu oferta y organizar tus reservas.","Ksoft Travel utiliza un modelo de comisión. Estamos preparando el piloto; consúltanos la disponibilidad, el porcentaje y las condiciones para participar."]),
  ],
};

