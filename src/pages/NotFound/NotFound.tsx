import { Link } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Footer } from "../../Components/Footer/Footer";

export const NotFound = () => (
  <>
    <Navbar title="Ksoft" imglogo="/img/logo.png" />
    <main id="main-content" tabIndex={-1} className="notFound">
      <p>404</p>
      <h1>Página no encontrada</h1>
      <p>El enlace puede haber cambiado o la página ya no está disponible.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
    <Footer />
  </>
);
