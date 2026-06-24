import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  return (
    <section className="mt-6">
      <h2 className="mb-4 text-xl font-bold">
        Productos Destacados
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
         <ProductCard
  key={product.id}
  {...product}
/>
        ))}
      </div>
    </section>
  );
}