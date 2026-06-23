export function SearchBar() {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Buscar productos..."
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