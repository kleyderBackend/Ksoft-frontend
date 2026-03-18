import { Navbar } from "../../Components/Navbar/Navbar";
import { HeaderSection } from "../../Components/HeaderSection/HeaderSection";
import { Footer } from "../../Components/Footer/Footer";
import { ContactInfo } from "../../Components/ContactInfo/ContactInfo";
import { ContactForm } from "../../Components/FormContact/FormContact";
import styles from "./ContactPages.module.css";

export const ContactPage = () => {
  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />

      <main className={styles.container}>
        <HeaderSection
          title="Hablemos"
          subTitle="Cuéntanos tu idea o necesidad"
        />

        <section className={styles.contactLayout}>
          <ContactInfo />
          <ContactForm />
        </section>
      </main>

      <Footer />
    </>
  );
};
