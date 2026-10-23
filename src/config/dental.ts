// Public product copy based on DOCUMENTACION KSOFT DENTAL V1.
// Capabilities come from the document; the owner confirmed pilot preparation status.
export const dentalProduct = {
  audience: ["Consultorios odontológicos privados", "Clínicas pequeñas y medianas", "Profesionales independientes"],
  modules: [
    { title: "Clínicas", status: "MVP", description: "Registro de la clínica y administración de su información institucional en un entorno propio." },
    { title: "Usuarios y roles", status: "MVP", description: "Gestión de usuarios internos con roles de administrador y doctor para organizar el acceso al sistema." },
    { title: "Pacientes", status: "MVP", description: "Registro, consulta y actualización de pacientes asociados a cada clínica." },
    { title: "Agenda y citas", status: "MVP", description: "Creación y actualización de citas, cambios de estado y asociación con el doctor responsable." },
    { title: "Recordatorios y confirmación", status: "Primera versión", description: "Recordatorio por correo 24 horas antes de la cita, con un enlace para confirmar o rechazar la asistencia." },
  ],
  appointmentFlow: [
    { title: "Se registra la cita", description: "La clínica programa la atención y relaciona el paciente y el doctor responsable." },
    { title: "Se envía el recordatorio", description: "El paciente recibe un recordatorio por correo 24 horas antes de su cita." },
    { title: "El paciente responde", description: "Desde el enlace del correo, el paciente puede confirmar o rechazar su asistencia." },
    { title: "La clínica da seguimiento", description: "El equipo consulta y actualiza el estado de las citas para organizar la atención del día." },
  ],
};
