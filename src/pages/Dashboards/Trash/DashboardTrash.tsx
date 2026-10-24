import { TrashManager } from "../../../Components/dashboards/components/Trash/TrashManager";
import styles from "./DashboardTrash.module.css";
export const DashboardTrash=()=> <><header className={styles.header}><h1 className={styles.title}>Papelera</h1><p className={styles.subtitle}>Recupera los registros archivados sin volver a diligenciarlos.</p></header><TrashManager/></>;

