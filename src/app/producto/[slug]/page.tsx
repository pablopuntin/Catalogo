import { getProductBySlug } from "@/lib/catalog/getProductBySlug";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <main className="p-4">
        Producto no encontrado
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="mx-auto max-w-3xl">
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square rounded-xl object-cover"
        />

        <h1 className="mt-4 text-2xl font-bold">
          {product.name}
        </h1>

        <p className="mt-2 text-xl font-semibold">
          ${product.price.toLocaleString()}
        </p>

        <span className="inline-block mt-3 rounded-full border px-3 py-1 text-sm">
          {product.category}
        </span>

        <p className="mt-4 text-sm opacity-80">
          {product.description}
        </p>

       

      </div>
    </main>
  );
}