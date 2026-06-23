import { categories } from "@/data/categories";

export function CategoryList() {
  return (
    <div className="mt-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className="
              whitespace-nowrap
              rounded-full
              border
              px-4
              py-2
              text-sm
            "
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}