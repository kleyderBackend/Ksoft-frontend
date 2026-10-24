import { RequestsManager } from "../../../Components/dashboards/components/Requests/RequestsManager";
import styles from "./DashboardRequests.module.css";
export const DashboardRequests=()=> <div className={styles.page}><header className={styles.header}><h1 className={styles.title}>Solicitudes</h1><p className={styles.subtitle}>Organiza solicitudes de piloto, consultas y oportunidades comerciales. Da seguimiento al contacto, al producto y, cuando corresponda, a su participación en el piloto.</p></header><RequestsManager/></div>;

