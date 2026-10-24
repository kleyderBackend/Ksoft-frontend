import {ProfileManager} from '../../../Components/dashboards/components/Profile/ProfileManager';
import styles from './DashboardProfile.module.css';
export function DashboardProfile(){return <><header className={styles.header}><p className={styles.eyebrow}>EQUIPO KSOFT</p><h1 className={styles.title}>Mi perfil</h1><p className={styles.subtitle}>Gestiona el acceso a tu cuenta de Ksoft.</p></header><ProfileManager/></>;}
