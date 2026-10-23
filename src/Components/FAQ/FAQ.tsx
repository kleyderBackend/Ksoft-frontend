import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./FAQ.module.css";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { CONTACT_EMAIL } from "../../config/contact";

type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "¿Qué es Ksoft?",
      answer:
        "Ksoft es una consultora de software especializada en desarrollar soluciones web a medida para automatizar procesos internos y mejorar la productividad de negocios y empresas.",
    },
    {
      question: "¿Qué tipo de servicios ofrece Ksoft?",
      answer:
        "Ofrecemos desarrollo de sistemas web, creación de paneles administrativos, automatización de procesos, integración con APIs externas y mantenimiento de software existente.",
    },
    {
      question: "¿Cómo puedo solicitar un servicio?",
      answer:
        `Puedes contactarnos mediante el formulario de contacto o escribirnos a ${CONTACT_EMAIL}. Respondemos con un análisis preliminar y pasos para iniciar tu proyecto.`,
    },
    {
      question: "¿Cuánto cuesta un desarrollo?",
      answer:
        "El precio depende del alcance, complejidad y tiempos de entrega del proyecto. Realizamos una evaluación gratuita para darte una cotización detallada.",
    },
    {
      question: "¿Trabajan con clientes fuera de Colombia?",
      answer:
        "Sí. Ksoft trabaja de forma remota con clientes en todo el mundo, adaptando horarios y formatos de comunicación según la ubicación del cliente.",
    },
    {
      question: "¿Ofrecen soporte post‑entrega?",
      answer:
        "Sí. Brindamos paquetes de soporte y mantenimiento para asegurar que el sistema funcione correctamente después de la entrega, con seguimiento y corrección de errores.",
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar title="Ksoft" imglogo="/img/logo.png" />
    <main id="main-content" tabIndex={-1} className={styles.container}>
      <h1 className={styles.title}>Preguntas Frecuentes</h1>
      {faqData.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            type="button"
            id={`faq-question-${index}`}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            className={styles.accordionButton}
            onClick={() => toggle(index)}
          >
            {item.question}
            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`}
            hidden={openIndex !== index} className={styles.accordionContent}>{item.answer}</div>
        </div>
      ))}
    </main>
    <Footer />
    </>
  );
};
