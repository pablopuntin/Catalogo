// 'use client';

// import { Suspense, useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Header } from '@/components/layout/Header';
// import { ProductGrid } from '@/components/catalog/ProductGrid';
// import { CartSheet } from '@/components/catalog/CartSheet';
// import { Footer } from '@/components/layout/Footer';
// import { catalogService } from '@/services/catalog.service';
// import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
// import { CatalogProduct, CatalogCategory } from '@/types/catalog';
// import { useCart } from '@/hooks/useCart';

// function CatalogoContent() {
//   const searchParams = useSearchParams();
//   const categoria = searchParams.get('categoria');
//   const marca = searchParams.get('marca');
//   const oferta = searchParams.get('oferta');
//   const q = searchParams.get('q') ?? '';

//   const [products, setProducts] = useState<CatalogProduct[]>([]);
//   const [categories, setCategories] = useState<CatalogCategory[]>([]);
//   const [config, setConfig] = useState<BusinessConfig | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [cartOpen, setCartOpen] = useState(false);

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

//   const filtered = products.filter((product) => {
//     const matchCategory = categoria
//       ? product.categories.some((c) => c.category.slug === categoria)
//       : true;
//     const matchBrand = marca ? product.brand?.slug === marca : true;
//     const matchOffer = oferta === '1' ? product.finalPrice !== null : true;
//     const matchSearch = q
//       ? product.name.toLowerCase().includes(q.toLowerCase())
//       : true;
//     return matchCategory && matchBrand && matchOffer && matchSearch;
//   });

//   let title = 'Catálogo';
//   if (oferta === '1') title = '🔥 Ofertas';
//   else if (categoria) {
//     title =
//       categories.find((c) => c.slug === categoria)?.name ?? 'Categoría';
//   } else if (marca) title = 'Marca';
//   if (q) title = `Resultados para "${q}"`;

//   return (
//     <>
//       <Header
//         count={totalItems}
//         config={config}
//         onCartOpen={() => setCartOpen(true)}
//         categories={categories}
//       />

//       <main className="p-4">
//         <h1 className="mb-4 text-lg font-bold text-white">{title}</h1>

//         {loading ? (
//           <p className="text-center text-neutral-400 text-sm py-16">
//             Cargando productos...
//           </p>
//         ) : (
//           <ProductGrid products={filtered} onAdd={add} />
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

// export default function CatalogoPage() {
//   return (
//     <Suspense fallback={null}>
//       <CatalogoContent />
//     </Suspense>
//   );
// }


//ref
'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CartSheet } from '@/components/catalog/CartSheet';
import { Footer } from '@/components/layout/Footer';
import { catalogService } from '@/services/catalog.service';
import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
import { CatalogProduct, CatalogCategory } from '@/types/catalog';
import { useCart } from '@/hooks/useCart';

const PAGE_SIZE = 20;

function CatalogoContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria') ?? undefined;
  const marca = searchParams.get('marca') ?? undefined;
  const oferta = searchParams.get('oferta') ?? undefined;
  const q = searchParams.get('q') ?? undefined;

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pausedByFooter, setPausedByFooter] = useState(false);

  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { cart, add, remove, confirm, totalItems } = useCart();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filters = useMemo(
    () => ({ categoria, marca, oferta, q }),
    [categoria, marca, oferta, q],
  );

  // Datos que no dependen de los filtros
  useEffect(() => {
    Promise.all([
      catalogService.getCategories().catch(() => []),
      businessConfigService.getPublic().catch(() => null),
    ]).then(([cats, cfg]) => {
      setCategories(cats);
      setConfig(cfg);
    });
  }, []);

  // Primera página (y cada vez que cambian los filtros)
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setProducts([]);
    setPage(1);

    catalogService
      .getProducts({ ...filters, page: 1, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.items);
        setTotal(res.total);
        setHasMore(res.hasMore);
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
        setHasMore(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await catalogService.getProducts({
        ...filters,
        page: next,
        limit: PAGE_SIZE,
      });
      setProducts((prev) => [...prev, ...res.items]);
      setPage(next);
      setHasMore(res.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [filters, page, hasMore, loadingMore]);

  // Pausa cuando el usuario entra al footer
  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) =>
        setPausedByFooter(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [loading]);

  // Auto-carga al acercarse al final
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || pausedByFooter) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: '300px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, pausedByFooter, loadMore]);

  let title = 'Catálogo';
  if (oferta === '1') title = '🔥 Ofertas';
  else if (categoria) {
    title = categories.find((c) => c.slug === categoria)?.name ?? 'Categoría';
  } else if (marca) title = 'Marca';
  if (q) title = `Resultados para "${q}"`;

  return (
    <>
      <Header
        count={totalItems}
        config={config}
        onCartOpen={() => setCartOpen(true)}
        categories={categories}
      />

      <main className="p-4">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h1 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
            {title}
          </h1>
          {!loading && total > 0 && (
            <span className="shrink-0 text-xs text-neutral-500 sm:text-sm">
              {total} {total === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-neutral-400">
            Cargando productos...
          </p>
        ) : (
          <>
            <ProductGrid products={products} onAdd={add} />

            {/* Disparador de la auto-carga */}
            <div ref={sentinelRef} className="h-1" />

            {loadingMore && (
              <p className="py-6 text-center text-sm text-neutral-400">
                Cargando más...
              </p>
            )}

            {!hasMore && products.length > 0 && (
              <p className="py-6 text-center text-xs text-neutral-600">
                No hay más productos.
              </p>
            )}
          </>
        )}
      </main>

      <Footer config={config} />

      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 right-4 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
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

export default function CatalogoPage() {
  return (
    <Suspense fallback={null}>
      <CatalogoContent />
    </Suspense>
  );
}