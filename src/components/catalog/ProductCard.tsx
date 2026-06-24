import { Product } from "@/types/products";
import Link from "next/link";

type ProductCardProps = Product;

export function ProductCard({
  slug,
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <Link
      href={`/producto/${slug}`}
      className="block"
    >
      <article
        className="
          rounded-xl
          border
          overflow-hidden
          bg-black
        "
      >
        
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="
              w-full
              aspect-square
              rounded-xl
              object-cover
            "
          />
        </div>

        <div className="p-3">
          <h3 className="font-medium">
            {name}
          </h3>

          <p className="mt-2 font-bold">
            ${price.toLocaleString()}
          </p>
        </div>
      </article>
    </Link>
  );
}