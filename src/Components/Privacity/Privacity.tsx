import React from "react";
import styles from "./Privacity.module.css";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";

export const Privacity: React.FC = () => {
  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />
      <div className={styles.container}>
        <h4 className={styles.title}>Política de Privacidad de KSoft</h4>
        <div className={styles.text}>
          <p>
            En <strong>KSoft</strong> nos comprometemos a proteger la privacidad
            y seguridad de los datos personales de nuestros usuarios. La
            presente política detalla cómo recopilamos, utilizamos, almacenamos
            y protegemos la información, conforme a los estándares legales y
            mejores prácticas internacionales.
          </p>

          <h5 className={styles.sectionTitle}>
            1. Principios de protección de datos
          </h5>
          <p>Nos regimos por los siguientes principios fundamentales:</p>
          <ul className={styles.list}>
            <li>
              <strong>Licitud, Equidad y Transparencia:</strong> Los datos se
              recopilan de manera legal, justa y siempre con información clara
              sobre su uso.
            </li>
            <li>
              <strong>Limitación de la Finalidad:</strong> La información se
              emplea únicamente para proporcionar nuestros servicios.
            </li>
            <li>
              <strong>Minimización de Datos:</strong> Solo solicitamos los datos
              estrictamente necesarios (nombre y correo electrónico).
            </li>
            <li>
              <strong>Exactitud:</strong> Garantizamos que los datos sean
              precisos y actualizados; fomentamos la corrección de información
              cuando sea necesario.
            </li>
            <li>
              <strong>Limitación de Almacenamiento:</strong> Conservamos la
              información solo durante el tiempo necesario para cumplir con la
              finalidad del tratamiento.
            </li>
            <li>
              <strong>Integridad y Confidencialidad:</strong> Aplicamos medidas
              técnicas y organizativas robustas para proteger los datos contra
              accesos no autorizados, pérdidas o alteraciones.
            </li>
            <li>
              <strong>Responsabilidad:</strong> Asumimos plena responsabilidad
              en el cumplimiento de esta política y la normativa aplicable.
            </li>
          </ul>

          <h5 className={styles.sectionTitle}>2. Datos que recopilamos</h5>
          <p>
            Solo recopilamos información necesaria para ofrecer nuestros
            servicios:
          </p>
          <ul className={styles.list}>
            <li>Nombre completo.</li>
            <li>Correo electrónico.</li>
          </ul>

          <h5 className={styles.sectionTitle}>3. Uso de la información</h5>
          <p>La información se utiliza exclusivamente para:</p>
          <ul className={styles.list}>
            <li>Proveer y mejorar nuestros servicios.</li>
            <li>Comunicar novedades, actualizaciones o soporte técnico.</li>
            <li>Cumplir obligaciones legales y regulatorias.</li>
          </ul>

          <h5 className={styles.sectionTitle}>4. Protección de los datos</h5>
          <p>
            Implementamos medidas de seguridad físicas, técnicas y
            administrativas avanzadas para asegurar la confidencialidad,
            integridad y disponibilidad de los datos. Esto incluye:
          </p>
          <ul className={styles.list}>
            <li>Cifrado de datos sensibles en tránsito y reposo.</li>
            <li>Control de accesos restringido a personal autorizado.</li>
            <li>Monitoreo constante de amenazas y vulnerabilidades.</li>
          </ul>

          <h5 className={styles.sectionTitle}>5. Derechos de los usuarios</h5>
          <p>
            Nuestros usuarios pueden ejercer sus derechos de acceso,
            rectificación, cancelación y oposición respecto a sus datos
            personales, así como solicitar su eliminación cuando corresponda.
            Para ello, pueden contactarnos mediante nuestros canales oficiales.
          </p>

          <h5 className={styles.sectionTitle}>6. Aceptación de la política</h5>
          <p>
            Al utilizar los servicios de <strong>KSoft</strong>, los usuarios
            aceptan la recopilación y tratamiento de sus datos conforme a esta
            política de privacidad.
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
};
