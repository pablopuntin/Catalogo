// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   return (
//     <main className="p-4">
//       <h1 className="text-2xl font-bold">
//         Producto
//       </h1>

//       <p className="mt-2">
//         Slug: {slug}
//       </p>
//     </main>
//   );
// }

//ref
import { getProductBySlug } from "@/lib/catalog/getProductBySlug";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">
        {product?.name}
      </h1>

      <p className="mt-2">
        ${product?.price.toLocaleString()}
      </p>
    </main>
  );
}