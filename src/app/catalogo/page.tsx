'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CartSheet } from '@/components/catalog/CartSheet';
import { Footer } from '@/components/layout/Footer';
import { catalogService } from '@/services/catalog.service';
import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
import { CatalogProduct, CatalogCategory } from '@/types/catalog';
import { useCart } from '@/hooks/useCart';

export default function CatalogoPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const { cart, add, remove, confirm, totalItems } = useCart();

  useEffect(() => {
    Promise.all([
      catalogService.getProducts(),
      catalogService.getCategories(),
      businessConfigService.getPublic().catch(() => null),
    ])
      .then(([prods, cats, cfg]) => {
        setProducts(prods);
        setCategories(cats);
        setConfig(cfg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === 'Todos'
        ? true
        : product.categories.some((c) => c.category.name === selectedCategory);
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Header
        count={totalItems}
        config={config}
        onCartOpen={() => setCartOpen(true)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        search={search}
        onSearchChange={setSearch}
      />

      <main className="p-4">
        <h1 className="mb-4 text-lg font-bold text-white">
          {selectedCategory === 'Todos' ? 'Catálogo' : selectedCategory}
        </h1>

        {loading ? (
          <p className="text-center text-neutral-400 text-sm py-16">
            Cargando productos...
          </p>
        ) : (
          <ProductGrid products={filteredProducts} onAdd={add} />
        )}
      </main>

      <Footer config={config} />

      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-semibold"
        >
          🛒 {totalItems}
        </button>
      )}

      {cartOpen && (
        <CartSheet
          cart={cart}
          onRemove={remove}
          onConfirm={() => {
            confirm(config?.whatsapp ?? '');
            setCartOpen(false);
          }}
          onClose={() => setCartOpen(false)}
        />
      )}
    </>
  );
}