import { CatalogProduct } from '@/types/catalog';
import Link from 'next/link';

type ProductCardProps = {
  product: CatalogProduct;
  onAdd: () => void;
};

function PromotionBadge({ type, discountValue }: {
  type: string;
  discountValue: string | null;
}) {
  const labels: Record<string, string> = {
    PERCENTAGE: `${discountValue}% OFF`,
    TWO_FOR_ONE: '2x1',
    FIXED: `$${Number(discountValue).toLocaleString('es-AR')} OFF`,
    FEATURED: '⭐ Destacado',
  };

  return (
    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {labels[type] ?? type}
    </span>
  );
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const hasDiscount = product.finalPrice !== null && product.promotion?.type !== 'FEATURED';

  return (
    <article className="rounded-xl border overflow-hidden bg-black">
      <div className="aspect-square overflow-hidden bg-neutral-900 relative">
        {image ? (
          <img
            src={image.url}
            alt={image.alt ?? product.name}
            className="w-full aspect-square object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-neutral-600 text-xs">Sin imagen</span>
          </div>
        )}

       </div>

      <div className="p-3">
        <p className="text-xs text-neutral-500 mb-1">
          {product.brand.name}
        </p>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>

        {/* <div className="mt-2">
          {hasDiscount ? (
            <>
              <p className="text-xs text-neutral-500 line-through">
                ${Number(product.price).toLocaleString('es-AR')}
              </p>
              <p className="font-bold text-sm text-green-400">
                ${Number(product.finalPrice).toLocaleString('es-AR')}
              </p>
            </>
          ) : (
            <p className="font-bold text-sm">
              ${Number(product.price).toLocaleString('es-AR')}
            </p>
          )}
        </div> */}

        <div className="mt-2">
  {hasDiscount ? (
    <>
      <div className="flex items-center gap-2">
        <p className="text-xs text-neutral-500 line-through">
          ${Number(product.price).toLocaleString('es-AR')}
        </p>
        <span className="text-xs text-red-500 font-semibold">
          {product.promotion?.type === 'PERCENTAGE' && `${product.promotion.discountValue}% OFF`}
          {product.promotion?.type === 'FIXED' && `$${Number(product.promotion.discountValue).toLocaleString('es-AR')} OFF`}
          {product.promotion?.type === 'TWO_FOR_ONE' && '2x1'}
        </span>
      </div>
      <p className="font-bold text-sm text-green-400">
        ${Number(product.finalPrice).toLocaleString('es-AR')}
      </p>
    </>
  ) : (
    <p className="font-bold text-sm">
      ${Number(product.price).toLocaleString('es-AR')}
    </p>
  )}
</div>

        <Link
          href={`/producto/${product.slug}`}
          className="mt-3 block rounded-lg border py-2 text-center text-sm"
        >
          Ver producto
        </Link>

        <button
          onClick={onAdd}
          className="mt-2 w-full rounded-lg bg-green-600 py-2 text-sm font-semibold"
        >
          Agregar a consulta
        </button>
      </div>
    </article>
  );
}