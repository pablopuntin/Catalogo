import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/catalog/SearchBar";
import { CategoryList } from "@/components/catalog/CategoryList";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export default function Home() {
  return (
    <>
      <Header />

      <main className="p-4">
        <SearchBar />
         <CategoryList />
          <ProductGrid />
      </main>
    </>
  );
}