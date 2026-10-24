export type ModuleKey =
  | "payments"
  | "expenses"
  | "projects"
  | "tasks"
  | "supports"
  | "contacts"
  | "clients"
  | "quotes"
  | "requests"
  | "files";
export interface BusinessRecord {
  id: string;
  values: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
export interface Workspace {
  records: Record<ModuleKey, BusinessRecord[]>;
  settings: { company: string; owner: string; email: string; currency: "COP" };
  readNotifications: string[];
}
export interface Field {
  key: string;
  label: string;
  type?: "text" | "textarea" | "email" | "tel" | "date" | "number" | "select";
  required?: boolean;
  options?: string[];
  relation?: ModuleKey;
}
export interface ModuleDefinition {
  title: string;
  singular: string;
  intro: string;
  fields: Field[];
}
const name = (label: string): Field => ({ key: "name", label, required: true });
const client: Field = {
  key: "client",
  label: "Cliente",
  type: "select",
  relation: "clients",
};
const notes: Field = { key: "notes", label: "Notas", type: "textarea" };
const amount: Field = {
  key: "amount",
  label: "Valor (COP)",
  type: "number",
  required: true,
};
const state = (options: string[]): Field => ({
  key: "status",
  label: "Estado",
  type: "select",
  options,
  required: true,
});
const due: Field = { key: "due", label: "Fecha límite", type: "date" };
export const modules: Record<ModuleKey, ModuleDefinition> = {
  requests: {
    title: "Solicitudes", singular: "solicitud",
    intro: "Registra y sigue consultas y solicitudes de piloto. La recepción automática desde la web todavía no está conectada.",
    fields: [name("Nombre de quien solicita"), {key:"email",label:"Correo electrónico",type:"email",required:true}, {key:"company",label:"Empresa"}, {key:"phone",label:"Teléfono",type:"tel"}, {key:"purpose",label:"Motivo",type:"select",options:["Participación en piloto","Cotización","Consulta general"],required:true}, {key:"product",label:"Producto de interés",type:"select"}, {key:"date",label:"Fecha de recepción",type:"date",required:true}, state(["Nueva","En seguimiento","Atendida","Descartada"]), {key:"message",label:"Mensaje",type:"textarea"}, {key:"contact",label:"Contacto asociado",type:"select",relation:"contacts"}, notes],
  },
  payments: {
    title: "Pagos",
    singular: "pago",
    intro: "Registra cobros, vencimientos y pagos recibidos de tus clientes.",
    fields: [
      name("Concepto"),
      { ...client, required: true },
      {
        key: "quote",
        label: "Cotización relacionada",
        type: "select",
        relation: "quotes",
      },
      amount,
      {
        key: "date",
        label: "Fecha del movimiento",
        type: "date",
        required: true,
      },
      due,
      state(["Pendiente", "Pagado", "Anulado"]),
      {
        key: "method",
        label: "Medio de pago",
        type: "select",
        options: ["Transferencia", "Efectivo", "Tarjeta", "Otro"],
      },
      notes,
    ],
  },
  expenses: {
    title: "Gastos",
    singular: "gasto",
    intro: "Lleva el control de tus gastos operativos y compromisos de pago.",
    fields: [
      name("Concepto"),
      {
        key: "category",
        label: "Categoría",
        type: "select",
        options: [
          "Software",
          "Infraestructura",
          "Marketing",
          "Servicios",
          "Otros",
        ],
      },
      amount,
      {
        key: "date",
        label: "Fecha del movimiento",
        type: "date",
        required: true,
      },
      due,
      state(["Pendiente", "Pagado", "Anulado"]),
      notes,
    ],
  },
  projects: {
    title: "Proyectos",
    singular: "proyecto",
    intro:
      "Organiza entregas, alcance y avances de los proyectos de tu empresa.",
    fields: [
      name("Nombre del proyecto"),
      client,
      {key:"quote",label:"Cotización de origen",type:"select",relation:"quotes"},
      state(["Planificado", "En curso", "En pausa", "Completado"]),
      { key: "start", label: "Fecha de inicio", type: "date" },
      due,
      { key: "progress", label: "Avance (%)", type: "number" },
      {
        key: "scope",
        label: "Alcance y entregables",
        type: "textarea",
        required: true,
      },
      notes,
    ],
  },
  tasks: {
    title: "Tareas",
    singular: "tarea",
    intro:
      "Convierte el trabajo pendiente en tareas con responsables y fechas.",
    fields: [
      name("Nombre de la tarea"),
      {
        key: "project",
        label: "Proyecto",
        type: "select",
        relation: "projects",
      },
      { key: "owner", label: "Responsable" },
      due,
      {
        key: "priority",
        label: "Prioridad",
        type: "select",
        options: ["Media", "Alta", "Baja"],
      },
      state(["Pendiente", "En curso", "Completada"]),
      notes,
    ],
  },
  supports: {
    title: "Soporte",
    singular: "ticket",
    intro:
      "Registra solicitudes, sigue su estado y deja constancia de la solución.",
    fields: [
      name("Asunto"),
      client,
      {
        key: "priority",
        label: "Prioridad",
        type: "select",
        options: ["Media", "Alta", "Baja"],
      },
      state(["Abierto", "En atención", "Resuelto"]),
      {
        key: "description",
        label: "Descripción del caso",
        type: "textarea",
        required: true,
      },
      { key: "resolution", label: "Solución", type: "textarea" },
      notes,
    ],
  },
  contacts: {
    title: "Contactos",
    singular: "contacto",
    intro:
      "Organiza prospectos y conversaciones comerciales. Convierte un contacto en cliente cuando corresponda.",
    fields: [
      name("Nombre"),
      {key:"client",label:"Cliente asociado",type:"select",relation:"clients"},
      { key: "company", label: "Empresa" },
      {
        key: "email",
        label: "Correo electrónico",
        type: "email",
        required: true,
      },
      { key: "phone", label: "Teléfono", type: "tel" },
      {
        key: "source",
        label: "Origen",
        type: "select",
        options: ["Web", "Referido", "Redes sociales", "Otro"],
      },
      state([
        "Nuevo",
        "Contactado",
        "En negociación",
        "Convertido",
        "Descartado",
      ]),
      notes,
    ],
  },
  clients: {
    title: "Clientes",
    singular: "cliente",
    intro:
      "Consulta los datos de tus clientes y su relación con proyectos, cotizaciones y pagos.",
    fields: [
      name("Nombre o razón social"),
      { key: "company", label: "Empresa" },
      {
        key: "email",
        label: "Correo electrónico",
        type: "email",
        required: true,
      },
      { key: "phone", label: "Teléfono", type: "tel" },
      state(["Activo", "Inactivo"]),
      notes,
    ],
  },
  quotes: {
    title: "Cotizaciones",
    singular: "cotización",
    intro:
      "Prepara propuestas comerciales y sigue su aceptación. Puedes imprimirlas o guardarlas como PDF desde el navegador.",
    fields: [
      name("Nombre de la propuesta"),
      { ...client, required: true },
      amount,
      { key: "date", label: "Fecha de emisión", type: "date", required: true },
      due,
      state(["Borrador", "Enviada", "Aceptada", "Rechazada"]),
      {
        key: "scope",
        label: "Alcance y entregables",
        type: "textarea",
        required: true,
      },
      { key: "terms", label: "Condiciones comerciales", type: "textarea" },
      notes,
    ],
  },
  files: {
    title: "Archivos",
    singular: "archivo",
    intro:
      "Guarda documentos e imágenes pequeños y relaciónalos con un proyecto.",
    fields: [
      name("Nombre del archivo"),
      {
        key: "project",
        label: "Proyecto",
        type: "select",
        relation: "projects",
      },
      notes,
    ],
  },
};
export const moduleKeys = Object.keys(modules) as ModuleKey[];
export function emptyWorkspace(): Workspace {
  return {
    records: {
      requests: [],
      payments: [],
      expenses: [],
      projects: [],
      tasks: [],
      supports: [],
      contacts: [],
      clients: [],
      quotes: [],
      files: [],
    },
    settings: {
      company: "Ksoft Technology",
      owner: "Kleyder Moreno Davila",
      email: "",
      currency: "COP",
    },
    readNotifications: [],
  };
}
export function validateRecord(
  module: ModuleKey,
  values: Record<string, string>,
  workspace: Workspace,
  id?: string,
  strictBusinessRules = true,
) {
  for (const field of modules[module].fields) {
    const value = values[field.key]?.trim() ?? "";
    if (field.required && !value)
      return "Completa " + field.label.toLowerCase() + ".";
    if (value && field.options && !field.options.includes(value))
      return "Selecciona una opción válida para " + field.label + ".";
    if (
      value &&
      field.relation &&
      !workspace.records[field.relation].some((record) => record.id === value)
    )
      return "El registro relacionado ya no existe: " + field.label + ".";
    if (
      value &&
      field.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      return "Escribe un correo válido.";
    if (
      value &&
      field.type === "date" &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value)
    )
      return "Revisa la fecha de " + field.label.toLowerCase() + ".";
    if (
      value &&
      field.type === "number" &&
      (!Number.isFinite(Number(value)) ||
        Number(value) < 0 ||
        Number(value) > 999999999999 ||
        !/^\d+(\.\d{1,2})?$/.test(value))
    )
      return "Usa un valor positivo con hasta dos decimales.";
  }
  if (
    values.progress &&
    (Number(values.progress) > 100 ||
      !Number.isInteger(Number(values.progress)))
  )
    return "El avance debe ser un entero entre 0 y 100.";
  if (values.start && values.due && values.due < values.start)
    return "La entrega debe ser posterior o igual al inicio.";
  if (
    module === "quotes" &&
    values.date &&
    values.due &&
    values.due < values.date
  )
    return "El vencimiento no puede ser anterior a la fecha del movimiento.";
  if (
    module === "supports" &&
    values.status === "Resuelto" &&
    !values.resolution?.trim()
  )
    return "Describe la solución antes de resolver el ticket.";
  if (
    (module === "clients" || module === "contacts") &&
    workspace.records[module].some(
      (record) =>
        record.id !== id &&
        record.values.email?.toLowerCase() ===
          values.email?.trim().toLowerCase(),
    )
  )
    return "Ya existe un registro con ese correo.";
  if (module === "payments" && values.quote) {
    const quote = workspace.records.quotes.find((q) => q.id === values.quote);
    if (quote?.values.client !== values.client)
      return "La cotización debe corresponder al cliente seleccionado.";
    if(strictBusinessRules && values.status!=="Anulado" && quote){
      const allocated=workspace.records.payments.filter(payment=>payment.id!==id&&payment.values.quote===values.quote&&payment.values.status!=="Anulado").reduce((sum,payment)=>sum+Math.round(Number(payment.values.amount||0)*100),0);
      if(allocated+Math.round(Number(values.amount||0)*100)>Math.round(Number(quote.values.amount)*100)) return "Los cobros asociados superan el valor de la cotización. Revisa los pagos y cobros pendientes.";
    }
  }
  if(module==="projects"&&values.quote&&workspace.records.quotes.find(quote=>quote.id===values.quote)?.values.client!==values.client) return "El cliente del proyecto debe coincidir con su cotización de origen.";
  if(strictBusinessRules&&module==="quotes"&&id){
    const allocated=workspace.records.payments.filter(payment=>payment.values.quote===id&&payment.values.status!=="Anulado").reduce((sum,payment)=>sum+Math.round(Number(payment.values.amount||0)*100),0);
    if(allocated>Math.round(Number(values.amount||0)*100)) return "El valor de la cotización no puede ser menor a sus cobros registrados.";
  }
  if (module === "quotes" && workspace.records.payments.some(payment => payment.values.quote === id && payment.values.client !== values.client)) return "Esta cotización tiene pagos asociados a otro cliente. Revisa esos pagos antes de cambiar el cliente.";
  if(module==="quotes"&&workspace.records.projects.some(project=>project.values.quote===id&&project.values.client!==values.client)) return "Esta cotización tiene un proyecto asociado a otro cliente. Revisa el proyecto antes de cambiar el cliente.";
  if(module==="requests"&&values.purpose==="Participación en piloto"&&!values.product) return "Selecciona el producto del piloto solicitado.";
  return "";
}
export function referencedBy(
  workspace: Workspace,
  module: ModuleKey,
  id: string,
) {
  const references = moduleKeys.flatMap((key) =>
    modules[key].fields.some((field) => field.relation === module)
      ? workspace.records[key]
          .filter((record) =>
            modules[key].fields.some(
              (field) =>
                field.relation === module && record.values[field.key] === id,
            ),
          )
          .map((record) => modules[key].title + ": " + record.values.name)
      : [],
  );
  if (module === "quotes") references.push(...workspace.records.projects.filter(project => project.values.quote === id).map(project => "Proyectos: " + project.values.name));
  return [...new Set(references)];
}
export function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}
export function quoteTotals(workspace: Workspace,quoteId: string) {
  const quote=workspace.records.quotes.find(record=>record.id===quoteId);
  const total=Math.round(Number(quote?.values.amount||0)*100);
  const sum=(status:string)=>workspace.records.payments.filter(record=>record.values.quote===quoteId&&record.values.status===status).reduce((acc,record)=>acc+Math.round(Number(record.values.amount||0)*100),0);
  const paid=sum("Pagado"),pending=sum("Pendiente");
  return {total:total/100,paid:paid/100,pending:pending/100,balance:(total-paid)/100,unallocated:(total-paid-pending)/100};
}
export function financialSummary(workspace: Workspace, from = "", to = "") {
  const inRange = (r: BusinessRecord) =>
    (!from || r.values.date >= from) && (!to || r.values.date <= to);
  const total = (key: "payments" | "expenses", status: string) =>
    workspace.records[key]
      .filter((r) => r.values.status === status && inRange(r))
      .reduce(
        (sum, r) => sum + Math.round(Number(r.values.amount || 0) * 100),
        0,
      ) / 100;
  const income = total("payments", "Pagado"),
    expenses = total("expenses", "Pagado");
  return {
    income,
    expenses,
    net: Math.round((income - expenses) * 100) / 100,
    receivable: total("payments", "Pendiente"),
    payable: total("expenses", "Pendiente"),
  };
}
export function csvCell(value: string) {
  const safe = /^(\s*[=+\-@]|[\t\r])/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export function parseWorkspace(value: unknown): Workspace {
  if (!value || typeof value !== "object")
    throw new Error("Espacio de trabajo inválido");
  const workspace = value as Workspace;
  if(workspace.records && workspace.records.requests===undefined) workspace.records.requests=[];
  const strings = (record: unknown): record is Record<string, string> =>
    !!record &&
    typeof record === "object" &&
    Object.values(record).every((v) => typeof v === "string");
  if (
    !workspace.records ||
    !strings(workspace.settings) ||
    ["company", "owner", "email", "currency"].some(
      (k) =>
        typeof workspace.settings[k as keyof Workspace["settings"]] !==
        "string",
    ) ||
    workspace.settings.currency !== "COP" ||
    !Array.isArray(workspace.readNotifications) ||
    workspace.readNotifications.some((v) => typeof v !== "string")
  )
    throw new Error("Configuración inválida");
  for (const key of moduleKeys) {
    const records = workspace.records[key];
    if (
      !Array.isArray(records) ||
      records.some(
        (r) =>
          !r ||
          typeof r.id !== "string" ||
          !r.id ||
          typeof r.createdAt !== "string" ||
          !Number.isFinite(Date.parse(r.createdAt)) ||
          typeof r.updatedAt !== "string" ||
          !Number.isFinite(Date.parse(r.updatedAt)) ||
          !strings(r.values),
      ) ||
      new Set(records.map((r) => r.id)).size !== records.length
    )
      throw new Error("Registros inválidos: " + key);
  }
  for (const key of moduleKeys)
    for (const record of workspace.records[key]) {
      if (validateRecord(key, record.values, workspace, record.id, false))
        throw new Error("Contenido inválido: " + modules[key].title);
      if (
        key === "files" &&
        (!/^[A-Za-z0-9+/]*={0,2}$/.test(record.values.base64 || "") ||
          Number(record.values.size) > 512000)
      )
        throw new Error("Archivo inválido");
    }
  return workspace;
}
