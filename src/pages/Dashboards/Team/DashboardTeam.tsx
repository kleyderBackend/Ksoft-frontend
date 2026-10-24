import {TeamManager} from '../../../Components/dashboards/components/Team/TeamManager';
import styles from './DashboardTeam.module.css';
export function DashboardTeam(){return <><header className={styles.header}><p className={styles.eyebrow}>EQUIPO KSOFT</p><h1 className={styles.title}>Equipo</h1><p className={styles.subtitle}>Gestiona las cuentas y responsabilidades del equipo de Ksoft.</p></header><TeamManager/></>;}
