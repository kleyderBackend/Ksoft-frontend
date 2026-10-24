import { ProductDetailSections } from "../../Components/ProductDetailSections/ProductDetailSections";
import { productSections } from "../../config/productSections";
import { products } from "../../config/products";
export const DentalProductDetails = () => <ProductDetailSections sections={productSections["saas-dental"]} contactHref={products[0].pilotHref} contactText="Solicitar participar en el piloto" />;
