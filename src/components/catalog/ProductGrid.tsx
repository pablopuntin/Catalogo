import { CatalogProduct } from '@/types/catalog';
import { ProductCard } from './ProductCard';

type ProductGridProps = {
  products: CatalogProduct[];
  onAdd: (product: CatalogProduct) => void;
};

export function ProductGrid({ products, onAdd }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-neutral-400 text-sm py-16">
        No se encontraron productos.
      </p>
    );
  }

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => onAdd(product)}
          />
        ))}
      </div>
    </section>
  );
}