import { categories } from "@/data/categories";

type CategoryListProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export function CategoryList({
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="mt-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              onSelectCategory(category.name)
            }
            className={`
              whitespace-nowrap
              rounded-full
              border
              px-4
              py-2
              text-sm
              ${
                selectedCategory === category.name
                  ? "bg-white text-black"
                  : ""
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}