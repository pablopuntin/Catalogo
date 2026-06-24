"use client";

import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/catalog/SearchBar";
import { CategoryList } from "@/components/catalog/CategoryList";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { products } from "@/data/products";
import { useState } from "react";
import { Product } from "@/types/products";

type CartItem = {
  product: Product;
  quantity: number;
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");
  const [search, setSearch] = useState("");  

  function handleAdd(product: Product) {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity < 5
                    ? item.quantity + 1
                    : 5,
              }
            : item
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  }

  const filteredProducts = products.filter(
  (product) => {
    const matchCategory =
      selectedCategory === "Todos"
        ? true
        : product.category === selectedCategory;

    const matchSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  }
);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const whatsappMessage =
    cart.length === 0
      ? "Hola, quisiera realizar una consulta."
      : `
Hola, quisiera consultar por los siguientes productos:

${cart
  .map(
    (item) =>
      `🛍️ ${item.product.name} x${item.quantity} - $${item.product.price.toLocaleString()}`
  )
  .join("\n")}

¿Tenes disponibilidad?

Total de productos: ${totalItems}
`;

  function handleWhatsApp() {
    const phone = "5493857408499";

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(url, "_blank");
  }

  return (
    <>
      <Header
        count={totalItems}
        message={whatsappMessage}
      />

      <main className="p-4">
        <SearchBar
  search={search}
  onSearchChange={setSearch}
/>
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={
            setSelectedCategory
          }
        />

        <ProductGrid
          products={filteredProducts}
          onAdd={handleAdd}
        />
      </main>

      <button
        onClick={handleWhatsApp}
        className="
          fixed
          bottom-4
          right-4
          bg-green-600
          text-white
          px-4
          py-3
          rounded-full
          shadow-lg
          text-sm
          font-semibold
        "
      >
        WhatsApp ({totalItems})
      </button>
    </>
  );
}