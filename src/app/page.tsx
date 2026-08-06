// 'use client';

// import { useEffect, useState } from 'react';
// import { Header } from '@/components/layout/Header';
// import { SearchBar } from '@/components/catalog/SearchBar';
// import { CategoryList } from '@/components/catalog/CategoryList';
// import { ProductGrid } from '@/components/catalog/ProductGrid';
// import { catalogService } from '@/services/catalog.service';
// import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
// import { CatalogProduct, CatalogCategory } from '@/types/catalog';
// import { quotesService } from '@/services/quotes.service';


// type CartItem = {
//   product: CatalogProduct;
//   quantity: number;
// };

// export default function Home() {
//   const [products, setProducts] = useState<CatalogProduct[]>([]);
//   const [categories, setCategories] = useState<CatalogCategory[]>([]);
//   const [config, setConfig] = useState<BusinessConfig | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('Todos');
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     Promise.all([
//       catalogService.getProducts(),
//       catalogService.getCategories(),
//       businessConfigService.getPublic().catch(() => null),
//     ])
//       .then(([prods, cats, cfg]) => {
//         setProducts(prods);
//         setCategories(cats);
//         setConfig(cfg);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   function handleAdd(product: CatalogProduct) {
//     setCart((prev) => {
//       const existing = prev.find((item) => item.product.id === product.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity < 5 ? item.quantity + 1 : 5 }
//             : item,
//         );
//       }
//       return [...prev, { product, quantity: 1 }];
//     });
//   }

//   const filteredProducts = products.filter((product) => {
//     const matchCategory =
//       selectedCategory === 'Todos'
//         ? true
//         : product.categories.some(
//             (c) => c.category.name === selectedCategory,
//           );
//     const matchSearch = product.name
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//   const whatsappMessage =
//     cart.length === 0
//       ? 'Hola, quisiera realizar una consulta.'
//       : `Hola, quisiera consultar por los siguientes productos:\n\n${cart
//           .map(
//             (item) =>
//               `🛍️ ${item.product.name} x${item.quantity} - $${Number(item.product.price).toLocaleString('es-AR')}`,
//           )
//           .join('\n')}\n\n¿Tenés disponibilidad?\n\nTotal de productos: ${totalItems}`;

//   // function handleWhatsApp() {
//   //   const phone = config?.whatsapp ?? '';
//   //   window.open(
//   //     `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`,
//   //     '_blank',
//   //   );
//   // }


//   async function handleWhatsApp() {
//   const phone = config?.whatsapp ?? '5493857408466';

//   // Guardar consulta en BD si hay productos en el carrito
//   if (cart.length > 0) {
//     quotesService.create({
//       items: cart.map((item) => ({
//         productId: item.product.id,
//         quantity: item.quantity,
//       })),
//       notes: 'Consulta desde el catálogo',
//     }).catch(() => {}); // silencioso — si falla no afecta al cliente
//   }

//   window.open(
//     `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`,
//     '_blank',
//   );
// }

//   return (
//     <>
//       <Header
//         count={totalItems}
//         message={whatsappMessage}
//         config={config}
//         onWhatsApp={handleWhatsApp}
//       />

//       <main className="p-4">
//         <SearchBar search={search} onSearchChange={setSearch} />

//         <CategoryList
//           categories={[
//             { id: 'all', name: 'Todos', slug: 'todos' },
//             ...categories,
//           ]}
//           selectedCategory={selectedCategory}
//           onSelectCategory={setSelectedCategory}
//         />

//         {loading ? (
//           <p className="text-center text-neutral-400 text-sm py-16">
//             Cargando productos...
//           </p>
//         ) : (
//           <ProductGrid products={filteredProducts} onAdd={handleAdd} />
//         )}
//       </main>

//       <button
//         onClick={handleWhatsApp}
//         className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-semibold"
//       >
//         WhatsApp ({totalItems})
//       </button>
//     </>
//   );
// }

//ref
'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/catalog/SearchBar';
import { CategoryList } from '@/components/catalog/CategoryList';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CartSheet } from '@/components/catalog/CartSheet';
import { catalogService } from '@/services/catalog.service';
import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
import { quotesService } from '@/services/quotes.service';
import { CatalogProduct, CatalogCategory } from '@/types/catalog';

type CartItem = {
  product: CatalogProduct;
  quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');

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

  function handleAdd(product: CatalogProduct) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity < 5 ? item.quantity + 1 : 5 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function handleRemove(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  async function handleConfirm() {
    const phone = config?.whatsapp ?? '';

    const message =
      cart.length === 0
        ? 'Hola, quisiera realizar una consulta.'
        : `Hola, quisiera consultar por los siguientes productos:\n\n${cart
            .map(
              (item) =>
                `🛍️ ${item.product.name} x${item.quantity} - $${Number(item.product.price).toLocaleString('es-AR')}`,
            )
            .join('\n')}\n\n¿Tenés disponibilidad?`;

    // Guardar consulta en BD
    if (cart.length > 0) {
      quotesService.create({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        notes: 'Consulta desde el catálogo',
      }).catch(() => {});
    }

    // Limpiar carrito y cerrar sheet
    setCart([]);
    setCartOpen(false);

    // Abrir WhatsApp
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank',
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === 'Todos'
        ? true
        : product.categories.some(
            (c) => c.category.name === selectedCategory,
          );
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Header
        count={totalItems}
        config={config}
        onCartOpen={() => setCartOpen(true)}
      />

      {/* <main className="p-4">
        <SearchBar search={search} onSearchChange={setSearch} />

        <CategoryList
          categories={[
            { id: 'all', name: 'Todos', slug: 'todos' },
            ...categories,
          ]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <p className="text-center text-neutral-400 text-sm py-16">
            Cargando productos...
          </p>
        ) : (
          <ProductGrid products={filteredProducts} onAdd={handleAdd} />
        )}
      </main> */}

        <main className="p-4">

  {/* Hero — solo si existe la imagen o descripción */}
  {(config?.heroImageUrl || config?.businessDescription) && (
    <div className="mb-6 rounded-xl overflow-hidden">
      {config.heroImageUrl && (
        <div className="aspect-video w-full bg-neutral-900">
          <img
            src={config.heroImageUrl}
            alt={config.businessName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {config.businessDescription && (
        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          {config.businessDescription}
        </p>
      )}
    </div>
  )}

  <SearchBar search={search} onSearchChange={setSearch} />

  <CategoryList
    categories={[
      { id: 'all', name: 'Todos', slug: 'todos' },
      ...categories,
    ]}
    selectedCategory={selectedCategory}
    onSelectCategory={setSelectedCategory}
  />

  {loading ? (
    <p className="text-center text-neutral-400 text-sm py-16">
      Cargando productos...
    </p>
  ) : (
    <ProductGrid products={filteredProducts} onAdd={handleAdd} />
  )}
</main>

      {/* Botón flotante — abre el sheet */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-semibold"
        >
          🛒 {totalItems}
        </button>
      )}

      {/* Cart Sheet */}
      {cartOpen && (
        <CartSheet
          cart={cart}
          onRemove={handleRemove}
          onConfirm={handleConfirm}
          onClose={() => setCartOpen(false)}
        />
      )}
    </>
  );
}