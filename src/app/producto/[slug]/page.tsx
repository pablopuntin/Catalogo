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

  //mensaje de guasa
 const whatsappMessage = `
Hola, quisiera consultar por el siguiente producto:

🛍️ ${product.name}

💲 Precio publicado: $${product.price.toLocaleString()}

¿Podrían informarme disponibilidad?
`;


//este es el link real al guasa
const whatsappUrl =
  `https://wa.me/3857408499?text=${encodeURIComponent(
    whatsappMessage
  )}`;


  return (
  <main className="p-4">
    <div
      className="
        mx-auto
        max-w-3xl
      "
    >
      <img
  src={product.image}
  alt={product.name}
  className="
    w-full
    aspect-square
    rounded-xl
    object-cover
  "
/>

      <h1
        className="
          mt-4
          text-2xl
          font-bold
        "
      >
        {product.name}
      </h1>

      <p
        className="
          mt-2
          text-xl
          font-semibold
        "
      >
        ${product.price.toLocaleString()}
      </p>

      <span
        className="
          inline-block
          mt-3
          rounded-full
          border
          px-3
          py-1
          text-sm
        "
      >
        {product.category}
      </span>

      <p
        className="
          mt-4
          text-sm
          opacity-80
        "
      >
        {product.description}
      </p>

      <a
  href={whatsappUrl}
  className="
    mt-6
    w-full
    md:w-1/2
    mx-auto
    block
    rounded-xl
    bg-green-600
    py-3
    text-center
    font-semibold
  "
>
  Consultar por WhatsApp
</a>
      </div>
    </main>
  );
}