import { ContactsManager } from "../../../Components/dashboards/components/Contacts/ContactsManager";
import styles from "./DashboardContacts.module.css";

export const DashboardContacts = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Contactos</h1>
        <p className={styles.subtitle}>Organiza prospectos y conversaciones comerciales. Convierte un contacto en cliente cuando corresponda.</p>
      </header>
      <ContactsManager />
    </>
  );
};
