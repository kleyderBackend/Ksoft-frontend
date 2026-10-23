import { FaPlus } from "react-icons/fa";
import styles from "./ProductQuestions.module.css";

export const ProductQuestions = ({ product }: { product: { name: string; slug: string; questions: { question: string; answer: string }[] } }) => (
  <section className={styles.section} aria-labelledby={`${product.slug}-questions-title`}>
    <header><p>ANTES DE PARTICIPAR</p><h2 id={`${product.slug}-questions-title`}>Preguntas sobre {product.name}</h2></header>
    <div>{product.questions.map(({ question, answer }) => <details key={question}><summary>{question}<FaPlus aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
  </section>
);
