import {createContext,useContext} from "react";
export type DashboardRole="admin"|"developer"|"qa"|"employee";
export interface DashboardAccess {role:DashboardRole;userId:string}
export const AccessContext=createContext<DashboardAccess>({role:"admin",userId:"local"});
export const useDashboardAccess=()=>useContext(AccessContext);

export const roleLabels:Record<DashboardRole,string>={admin:"Administración",developer:"Development",qa:"QA · Calidad",employee:"Equipo"};
