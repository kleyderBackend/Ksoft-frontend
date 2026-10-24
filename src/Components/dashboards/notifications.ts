import type { AdminData } from "./adminModel";
import { moduleKeys, modules } from "./businessModel.ts";
export function getNotifications(data: AdminData, today: string) {
  const activity = data.activity.map((a) => ({
    id: a.id,
    title: a.title,
    description: "Cambio guardado en tu espacio de trabajo.",
    date: a.date.slice(0, 10),
    href: "/dashboard",
  }));
  const overdue = moduleKeys.flatMap((key) =>
    data.workspace.records[key]
      .filter(
        (r) =>
          r.values.due &&
          r.values.due < today &&
          ![
            "Pagado",
            "Anulado",
            "Completado",
            "Completada",
            "Resuelto",
            "Rechazada",
            "Aceptada",
          ].includes(r.values.status),
      )
      .map((r) => ({
        id: key + "-" + r.id + "-" + r.values.due,
        title: "Fecha vencida: " + r.values.name,
        description:
          modules[key].title + " · Revisa el estado y la fecha límite.",
        date: r.values.due,
        href: "/dashboard/" + key,
      })),
  );
  const requests=data.workspace.records.requests.filter(record=>record.values.status==="Nueva").map(record=>({id:"request-"+record.id+"-"+record.updatedAt,title:"Solicitud pendiente: "+record.values.name,description:record.values.purpose||"Revisa la solicitud registrada.",date:record.values.date||record.createdAt.slice(0,10),href:"/dashboard/requests?record="+encodeURIComponent(record.id)}));
  return [...requests,...overdue, ...activity];
}
