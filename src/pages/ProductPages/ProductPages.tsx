import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowUp, FaTooth, FaLayerGroup, FaRegCompass, FaRegComments, FaCheckCircle, FaPlus } from "react-icons/fa";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Footer } from "../../Components/Footer/Footer";
import { products } from "../../config/products";
import styles from "./ProductPages.module.css";

const steps = [
  { icon: FaRegCompass, title: "Conoce el producto", description: "Explora la plataforma y revisa si su enfoque responde a las necesidades de tu negocio." },
  { icon: FaRegComments, title: "Conversemos sobre el acceso", description: "Consúltanos sobre la disponibilidad, las funciones y las condiciones del producto que te interesa." },
  { icon: FaCheckCircle, title: "Elige con información clara", description: "Antes de contratar, confirma el plan o la licencia, sus límites y las condiciones de uso aplicables." },
];

const questions = [
  { question: "¿Qué significa acceso anticipado?", answer: "Es el estado actual con el que presentamos SaaS Dental. Contáctanos para confirmar la disponibilidad de acceso y las funcionalidades que puedes utilizar antes de contratar." },
  { question: "¿Cómo se contratan los productos?", answer: "Los productos SaaS de Ksoft se ofrecen mediante suscripción o licencia de uso. Los planes, tarifas, funcionalidades y límites se definen en la oferta de cada producto. Puedes consultarnos las condiciones vigentes." },
  { question: "¿Puedo solicitar una solución a medida?", answer: "Sí. Además de nuestros productos propios, desarrollamos software, sitios web y aplicaciones a medida. Cuéntanos tus requisitos para evaluar un proyecto con un alcance específico para tu empresa." },
];

export const ProductsPage = () => (
  <>
    <Navbar title="Ksoft" imglogo="/img/logo.png" />
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <section className={styles.hero} aria-labelledby="products-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PRODUCTOS DE KSOFT TECHNOLOGY</p>
          <h1 id="products-title">Software propio.<br /><span>Enfocado en tu sector.</span></h1>
          <p className={styles.lead}>Creamos productos SaaS para necesidades concretas de negocio. Conoce nuestras plataformas y encuentra el siguiente paso para tu empresa.</p>
          <p className={styles.body}>Además de desarrollar proyectos a medida, construimos soluciones propias con acceso mediante suscripción o licencia.</p>
          <div className={styles.actions}>
            <Link className={styles.primaryLink} to="/products#catalogo">Conocer los productos <FaArrowRight aria-hidden="true" /></Link>
            <Link className={styles.textLink} to="/contact">Consultar con Ksoft <FaArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        <div className={styles.productVisual}>
          <div className={styles.visualTop}><span><FaLayerGroup aria-hidden="true" />PRODUCTO PROPIO</span><span className={styles.status}><i aria-hidden="true" />Acceso anticipado</span></div>
          <div className={styles.toothStage} aria-hidden="true"><div className={styles.orbit} /><div className={styles.toothIcon}><FaTooth /></div></div>
          <p className={styles.visualName}>{products[0].name}</p>
          <p className={styles.visualCaption}>Software para clínicas dentales</p>
          <div className={styles.visualBottom}><span>Ksoft Technology</span><span>Soluciones por sector</span></div>
        </div>
      </section>

      <section className={styles.catalog} id="catalogo" aria-labelledby="catalog-title">
        <header className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>EXPLORA NUESTRAS PLATAFORMAS</p><h2 id="catalog-title">Conoce nuestros productos</h2></div>
          <p>Un enfoque específico para cada sector, con las condiciones de acceso definidas para cada producto.</p>
        </header>
        {products.map((product) => (
          <article className={styles.productCard} key={product.name}>
            <div className={styles.productBrand}>
              <span className={styles.productSymbol} aria-hidden="true">{product.icon}</span>
              <p className={styles.eyebrow}>SALUD DENTAL</p>
              <h3>{product.name}</h3>
              <p>Un producto de Ksoft Technology</p>
              <span className={styles.status}><i aria-hidden="true" />{product.comingSoon ? "Acceso anticipado" : "Conoce su disponibilidad"}</span>
            </div>
            <div className={styles.productInfo}>
              <p className={styles.cardLabel}>PARA LA GESTIÓN DE CLÍNICAS DENTALES</p>
              <h4>Conoce una solución pensada para tu clínica.</h4>
              <p>{product.description}</p>
              <dl className={styles.facts}>
                <div><dt>Dirigido a</dt><dd>Clínicas dentales</dd></div>
                <div><dt>Modalidad</dt><dd>Producto SaaS</dd></div>
                <div><dt>Disponibilidad</dt><dd>Consulta el acceso anticipado</dd></div>
              </dl>
              <div className={styles.actions}>
                <a className={styles.primaryLink} href={product.href} target="_blank" rel="noopener noreferrer">{product.buttonText}<span className={styles.srOnly}> (abre en una pestaña nueva)</span><FaArrowUp className={styles.externalArrow} aria-hidden="true" /></a>
                <Link className={styles.textLink} to="/contact">Preguntar por el acceso <FaArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.accessSection} aria-labelledby="access-title">
        <header className={styles.centeredHeader}>
          <p className={styles.eyebrow}>ANTES DE COMENZAR</p>
          <h2 id="access-title">Encuentra la opción para tu negocio</h2>
          <p>Conoce el producto y resuelve tus dudas sobre el acceso antes de tomar una decisión.</p>
        </header>
        <ol className={styles.steps}>
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title}>
              <div className={styles.stepTop}><span className={styles.stepNumber}>0{index + 1}</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3><p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.faqSection} aria-labelledby="product-faq-title">
        <div className={styles.faqIntro}>
          <p className={styles.eyebrow}>RESOLVEMOS TUS DUDAS</p>
          <h2 id="product-faq-title">Antes de elegir<br />tu plataforma</h2>
          <p>Si necesitas información específica sobre SaaS Dental, puedes hablar directamente con nosotros.</p>
          <Link className={styles.textLink} to="/contact">Hacer una consulta <FaArrowRight aria-hidden="true" /></Link>
        </div>
        <div className={styles.questions}>
          {questions.map(({ question, answer }) => (
            <details key={question} className={styles.question}>
              <summary>{question}<FaPlus aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.customSection} aria-labelledby="custom-title">
        <div><p className={styles.eyebrow}>TAMBIÉN DESARROLLAMOS A MEDIDA</p><h2 id="custom-title">¿Tu empresa necesita algo diferente?</h2><p>Cuéntanos tus requisitos. Podemos evaluar una solución con un alcance definido para tu negocio.</p></div>
        <Link className={styles.primaryLink} to="/contact">Cotizar un proyecto <FaArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
    <Footer />
  </>
);
