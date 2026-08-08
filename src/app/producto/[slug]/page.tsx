//ref ahora muestra productos en grande, galeria deslizable, mas informacion que las cards
'use client';

import { Suspense, use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSheet } from '@/components/catalog/CartSheet';
import { catalogService } from '@/services/catalog.service';
import { businessConfigService, BusinessConfig } from '@/services/business-config.service';
import { CatalogProduct, CatalogCategory } from '@/types/catalog';
import { useCart } from '@/hooks/useCart';

function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Galería
  const trackRef = useRef<HTMLDivElement>(null);
  const [imgIndex, setImgIndex] = useState(0);

  const { cart, add, remove, confirm, totalItems } = useCart();

  useEffect(() => {
    Promise.all([
      catalogService.getProductBySlug(slug),
      catalogService.getCategories().catch(() => []),
      businessConfigService.getPublic().catch(() => null),
    ])
      .then(([prod, cats, cfg]) => {
        setProduct(prod);
        setCategories(cats);
        setConfig(cfg);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  function goToImage(i: number) {
    setImgIndex(i);
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    }
  }

  function syncIndex() {
    const track = trackRef.current;
    if (!track) return;
    setImgIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  const images = product?.images ?? [];
  const hasDiscount =
    product?.finalPrice != null && product.promotion?.type !== 'FEATURED';

  return (
    <>
      <Header
        count={totalItems}
        config={config}
        onCartOpen={() => setCartOpen(true)}
        categories={categories}
      />

      <main className="p-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/catalogo"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            ← Volver al catálogo
          </Link>

          {loading && (
            <p className="py-16 text-center text-sm text-neutral-400">
              Cargando producto...
            </p>
          )}

          {notFound && (
            <p className="py-16 text-center text-sm text-neutral-400">
              Producto no encontrado.
            </p>
          )}

          {product && (
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:gap-8">
              {/* Galería */}
              <div className="md:w-1/2">
                <div className="relative">
                  {product.featured && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                      ⭐ Destacado
                    </span>
                  )}

                  <div
                    ref={trackRef}
                    onScroll={syncIndex}
                    className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-xl"
                  >
                    {images.length > 0 ? (
                      images.map((img) => (
                        <div
                          key={img.id}
                          className="aspect-square w-full shrink-0 snap-center bg-neutral-900"
                        >
                          <img
                            src={img.url}
                            alt={img.alt ?? product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex aspect-square w-full shrink-0 items-center justify-center bg-neutral-900">
                        <span className="text-sm text-neutral-500">
                          Sin imagen
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="mt-3 flex justify-center gap-2">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => goToImage(i)}
                        aria-label={`Imagen ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          i === imgIndex ? 'w-5 bg-white' : 'w-2 bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              Datos
              <div className="md:w-1/2">
                {/* Nombre — lo más grande */}
                <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                  {product.name}
                </h1>

                {/* Precio */}
                <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                  {hasDiscount ? (
                    <>
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Precio de lista
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base text-neutral-500 line-through sm:text-lg">
                          ${Number(product.price).toLocaleString('es-AR')}
                        </span>
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                          {product.promotion?.type === 'PERCENTAGE' &&
                            `${product.promotion.discountValue}% OFF`}
                          {product.promotion?.type === 'FIXED' &&
                            `$${Number(product.promotion.discountValue).toLocaleString('es-AR')} OFF`}
                          {product.promotion?.type === 'TWO_FOR_ONE' && '2x1'}
                        </span>
                      </div>

                      <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
                        Precio final
                      </p>
                      <p className="text-3xl font-bold text-green-400 sm:text-4xl">
                        ${Number(product.finalPrice).toLocaleString('es-AR')}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Precio
                      </p>
                      <p className="text-3xl font-bold text-white sm:text-4xl">
                        ${Number(product.price).toLocaleString('es-AR')}
                      </p>
                    </>
                  )}
                </div>

                {/* Agregar */}
                <button
                  onClick={() => add(product)}
                  className="mt-5 w-full rounded-lg bg-green-600 py-3 text-base font-semibold text-white transition-colors hover:bg-green-500"
                >
                  Agregar a consulta
                </button>

                {/* Ficha de datos */}
                <dl className="mt-6 divide-y divide-neutral-800 border-y border-neutral-800">
                  {product.brand?.name && (
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-sm text-neutral-500">Marca</dt>
                      <dd className="text-right text-sm font-medium text-white sm:text-base">
                        {product.brand.name}
                      </dd>
                    </div>
                  )}

                  {product.sku && (
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-sm text-neutral-500">Código</dt>
                      <dd className="text-right text-sm font-medium text-white sm:text-base">
                        {product.sku}
                      </dd>
                    </div>
                  )}

                  {product.categories.length > 0 && (
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-sm text-neutral-500">Categorías</dt>
                      <dd className="flex flex-wrap justify-end gap-2">
                        {product.categories.map((c) => (
                          <Link
                            key={c.category.id}
                            href={`/catalogo?categoria=${c.category.slug}`}
                            className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500"
                          >
                            {c.category.name}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>

                {/* Descripción */}
                {product.description && (
                  <div className="mt-6">
                    <h2 className="mb-2 text-base font-semibold text-white sm:text-lg">
                      Características
                    </h2>
                    <p className="whitespace-pre-line text-base leading-relaxed text-neutral-300 sm:text-lg">
                      {product.description}
                    </p>
                  </div>
                
                )}
              </div>
            </div>
          )}
        </div>
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

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <ProductContent params={params} />
    </Suspense>
  );
}