import ProductsGrid from "../../_components/ProdcutGrid";

export default function AllProductsPage() {
  
  return <ProductsGrid title="All Products" pageSize={20} refreshMs={10000}   />;
}
