import { ProductDetailSections } from "../../Components/ProductDetailSections/ProductDetailSections";
import { productSections } from "../../config/productSections";
import { products } from "../../config/products";
export const TravelProductDetails = () => <ProductDetailSections sections={productSections["ksoft-travel"]} contactHref={products[1].pilotHref} contactText="Solicitar participar en el piloto" />;
