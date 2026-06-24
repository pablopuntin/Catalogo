import { Product } from "@/types/products";
import Link from "next/link";

type ProductCardProps = Product & {
  onAdd: () => void;
};

export function ProductCard({
  slug,
  name,
  price,
  image,
  onAdd,
}: ProductCardProps) {
  return (
    <article className="rounded-xl border overflow-hidden bg-black">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full aspect-square object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="font-medium">{name}</h3>

        <p className="mt-2 font-bold">
          ${price.toLocaleString()}
        </p>

        <Link
          href={`/producto/${slug}`}
          className="mt-3 block rounded-lg border py-2 text-center"
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