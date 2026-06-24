type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function SearchBar({
  search,
  onSearchChange,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-3
          text-sm
          outline-none
          focus:border-gray-500
        "
      />
    </div>
  );
}