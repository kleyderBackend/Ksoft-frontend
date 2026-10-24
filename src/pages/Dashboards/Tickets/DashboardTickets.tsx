import {TicketsManager} from '../../../Components/dashboards/components/Tickets/TicketsManager';
import styles from './DashboardTickets.module.css';
export function DashboardTickets(){return <><header className={styles.header}><p className={styles.eyebrow}>EQUIPO KSOFT</p><h1 className={styles.title}>Tickets internos</h1><p className={styles.subtitle}>Un espacio para resolver solicitudes y coordinar el trabajo.</p></header><TicketsManager/></>;}
