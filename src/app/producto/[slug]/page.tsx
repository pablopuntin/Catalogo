import { getProductBySlug } from '@/lib/catalog/getProductBySlug';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    return (
      <main className="p-4">
        <p>Producto no encontrado.</p>
      </main>
    );
  }

  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];

  return (
    <main className="p-4">
      <div className="mx-auto max-w-3xl">

        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900">
          {image ? (
            <img
              src={image.url}
              alt={image.alt ?? product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-500 text-sm">Sin imagen</span>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-neutral-400">
          {product.brand.name}
        </p>

        <h1 className="mt-1 text-2xl font-bold">
          {product.name}
        </h1>

        <p className="mt-2 text-xl font-semibold">
          ${Number(product.price).toLocaleString('es-AR')}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {product.categories.map((c) => (
            <span
              key={c.categoryId}
              className="rounded-full border px-3 py-1 text-xs"
            >
              {c.category.name}
            </span>
          ))}
        </div>

        {product.description && (
          <p className="mt-4 text-sm opacity-80">
            {product.description}
          </p>
        )}

      </div>
    </main>
  );
}