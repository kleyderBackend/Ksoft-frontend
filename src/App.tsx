import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Landing } from "./pages/Landing/Landing";
import { AboutPages } from "./pages/AboutPages/AboutPages";
import { ProductsPage } from "./pages/ProductPages/ProductPages";
import { ContactPage } from "./pages/ContactPages/ContactPages";
import { FAQ } from "./Components/FAQ/FAQ";
import { Privacity } from "./Components/Privacity/Privacity";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacity" element={<Privacity />} />
      </Routes>
    </>
  );
}

export default App;
