import { createContext, useContext } from "react";
import type { AdminData } from "./adminModel";
import type { EntityModule } from "./models/recoveryModel";
import type {DashboardRole} from "./accessContext";
export interface SaveOptions {restoreBackup?:boolean;publication?:{module:"posts"|"products"|"publicProjects";id:string;action:"publish"|"unpublish"}}
export const AdminContext = createContext<{
  data: AdminData;
  save: (next: AdminData, message: string, logActivity?: boolean, options?: SaveOptions) => Promise<boolean>;
  trash: (module: EntityModule, id: string) => Promise<boolean>;
  restore: (trashId: string) => Promise<boolean>;
  cloud: boolean;
  saving: boolean;
  publish: () => Promise<boolean>;
  role: DashboardRole;
  refresh: () => Promise<boolean>;
} | null>(null);
export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("Se requiere el panel administrativo.");
  return value;
}
