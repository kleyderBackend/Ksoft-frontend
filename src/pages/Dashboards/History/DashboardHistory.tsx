import { HistoryManager } from "../../../Components/dashboards/components/History/HistoryManager";
import styles from "./DashboardHistory.module.css";
export const DashboardHistory=()=> <><header className={styles.header}><h1 className={styles.title}>Historial de cambios</h1><p className={styles.subtitle}>Consulta qué cambió en tus registros y cuándo se guardó.</p></header><HistoryManager/></>;

