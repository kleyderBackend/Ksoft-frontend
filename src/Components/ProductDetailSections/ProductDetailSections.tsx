import { Fragment } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarCheck, FaUsers, FaEnvelopeOpenText } from "react-icons/fa";
import type { DetailSection } from "../../config/productSections";
import styles from "./ProductDetailSections.module.css";
export const ProductDetailSections = ({sections,contactHref,contactText}: {sections: DetailSection[]; contactHref: string; contactText: string}) => (
  <div className={styles.details}>{sections.map(section => {
    const heading = <><p className={styles.eyebrow}>{section.eyebrow}</p><h2 id={section.id + "-title"}>{section.title}</h2>{section.description && <p>{section.description}</p>}{section.paragraphs.map((paragraph,index) => <p key={index}>{paragraph}</p>)}</>;
    if (section.type === "audience") return <section className={styles.audience} aria-labelledby={section.id + "-title"} key={section.id}><div>{heading}</div><ul>{section.items.map((item,index) => <li key={index}>{item.title}</li>)}</ul></section>;
    if (section.type === "commercial") return <section className={styles.commercial} aria-labelledby={section.id + "-title"} key={section.id}><div>{heading}</div><Link to={contactHref} className={styles.contactLink}>{contactText} <FaArrowRight aria-hidden="true" /></Link></section>;
    return <section className={styles.section} aria-labelledby={section.id + "-title"} key={section.id}><header className={styles.header}>{heading}</header>
      {section.type === "flow" ? <>{section.flowLabels.length > 0 && <div className={styles.flowSummary} aria-hidden="true">{section.flowLabels.map((label,index) => <Fragment key={index}>{index > 0 && <FaArrowRight />}{index === 0 ? <FaUsers /> : index === 1 ? <FaCalendarCheck /> : <FaEnvelopeOpenText />}<span>{label}</span></Fragment>)}</div>}<ol className={styles.flow}>{section.items.map((item,index) => <li key={index}><span className={styles.number} aria-hidden="true">{String(index+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></> : <div className={section.type === "architecture" ? styles.architecture : styles.modules}>{section.items.map((item,index) => <article key={index}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>}
    </section>;
  })}</div>
);

