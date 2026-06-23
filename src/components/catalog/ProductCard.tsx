type ProductCardProps = {
  name: string;
  price: number;
  image: string;
};

export function ProductCard({
  name,
  price,
  image,
}: ProductCardProps) {
  return (
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
            h-full
            w-full
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
  );
}