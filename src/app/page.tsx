// //ref para nuevas funcionalidades
// 'use client';

// import { useEffect, useState } from 'react';
// import { Header } from '@/components/layout/Header';
// import { ProductGrid } from '@/components/catalog/ProductGrid';
// import { FeaturedCarousel } from '@/components/catalog/FeaturedCarousel';
// import { CartSheet } from '@/components/catalog/CartSheet';
// import { catalogService } from '@/services/catalog.service';
// import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
// import { CatalogProduct, CatalogCategory } from '@/types/catalog';
// import { Footer } from '@/components/layout/Footer';
// import { useCart } from '@/hooks/useCart';

// export default function Home() {
//   const [products, setProducts] = useState<CatalogProduct[]>([]);
//   const [categories, setCategories] = useState<CatalogCategory[]>([]);
//   const [config, setConfig] = useState<BusinessConfig | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('Todos');
//   const [search, setSearch] = useState('');

//   const { cart, add, remove, confirm, totalItems } = useCart();

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

//   // const featured = products.filter(
//   //   (product) => product.promotion?.type === 'FEATURED',
//   // );

//   //ahora filtra por featured, osea por promociones
//   const featured = products.filter((product) => product.featured);

//   const filteredProducts = products.filter((product) => {
//     const matchCategory =
//       selectedCategory === 'Todos'
//         ? true
//         : product.categories.some((c) => c.category.name === selectedCategory);
//     const matchSearch = product.name
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   return (
//     <>
//       <Header
//         count={totalItems}
//         config={config}
//         onCartOpen={() => setCartOpen(true)}
//         categories={categories}
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//         search={search}
//         onSearchChange={setSearch}
//       />

//       <main className="p-4">
//         {/* Hero — solo si existe la imagen o descripción */}
//         {(config?.heroImageUrl || config?.businessDescription) && (
//           <div className="mb-6 rounded-xl overflow-hidden">
//             {config.heroImageUrl && (
//               <div className="aspect-video w-full bg-neutral-900">
//                 <img
//                   src={config.heroImageUrl}
//                   alt={config.businessName}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             {config.businessDescription && (
//               <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
//                 {config.businessDescription}
//               </p>
//             )}
//           </div>
//         )}

//         {!loading && <FeaturedCarousel products={featured} onAdd={add} />}

//         {loading ? (
//           <p className="text-center text-neutral-400 text-sm py-16">
//             Cargando productos...
//           </p>
//         ) : (
//           <ProductGrid products={filteredProducts} onAdd={add} />
//         )}
//       </main>

//       <Footer config={config} />

//       {totalItems > 0 && (
//         <button
//           onClick={() => setCartOpen(true)}
//           className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-semibold"
//         >
//           🛒 {totalItems}
//         </button>
//       )}

//       {cartOpen && (
//         <CartSheet
//           cart={cart}
//           onRemove={remove}
//           onConfirm={() => {
//             confirm(config?.whatsapp ?? '');
//             setCartOpen(false);
//           }}
//           onClose={() => setCartOpen(false)}
//         />
//       )}
//     </>
//   );
// }


//ref, Home VITRINA
'use client';

import { Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FeaturedCarousel } from '@/components/catalog/FeaturedCarousel';
import { BrandsSection } from '@/components/catalog/BrandsSection';
import { CartSheet } from '@/components/catalog/CartSheet';
import { catalogService } from '@/services/catalog.service';
import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
import { CatalogProduct, CatalogCategory, CatalogBrand } from '@/types/catalog';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';

function HomeContent() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const { cart, add, remove, confirm, totalItems } = useCart();

  useEffect(() => {
    Promise.all([
      catalogService.getProducts(),
      catalogService.getCategories(),
      catalogService.getBrands().catch(() => []),
      businessConfigService.getPublic().catch(() => null),
    ])
      .then(([prods, cats, brs, cfg]) => {
        setProducts(prods);
        setCategories(cats);
        setBrands(brs);
        setConfig(cfg);
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.featured);
  const offers = products.filter((p) => p.finalPrice !== null);

  return (
    <>
      <Header
        count={totalItems}
        config={config}
        onCartOpen={() => setCartOpen(true)}
        categories={categories}
      />

      <main className="p-4">
        {/* Banner */}
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

        {loading ? (
          <p className="text-center text-neutral-400 text-sm py-16">
            Cargando...
          </p>
        ) : (
          <>
            {/* Secciones del home — agregar más acá abajo */}
            <FeaturedCarousel products={featured} onAdd={add} />

            <BrandsSection brands={brands} />

            <FeaturedCarousel
              products={offers}
              onAdd={add}
              title="🔥 Ofertas"
            />
          </>
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

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}