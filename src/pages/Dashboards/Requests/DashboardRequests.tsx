import { RequestsManager } from "../../../Components/dashboards/components/Requests/RequestsManager";
import styles from "./DashboardRequests.module.css";
export const DashboardRequests=()=> <><header className={styles.header}><h1 className={styles.title}>Solicitudes</h1><p className={styles.subtitle}>Organiza solicitudes de piloto, consultas y oportunidades comerciales. Da seguimiento al producto de interés, al contacto y al estado de cada solicitud.</p></header><RequestsManager/></>;

