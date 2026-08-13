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
  const [featured, setFeatured] = useState<CatalogProduct[]>([]);
  const [offers, setOffers] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const { cart, add, remove, confirm, totalItems } = useCart();

  useEffect(() => {
    Promise.all([
      catalogService.getProducts({ destacado: '1', limit: 20 }),
      catalogService.getProducts({ oferta: '1', limit: 20 }),
      catalogService.getCategories(),
      catalogService.getBrands().catch(() => []),
      businessConfigService.getPublic().catch(() => null),
    ])
      .then(([feat, offs, cats, brs, cfg]) => {
        setFeatured(feat.items);
        setOffers(offs.items);
        setCategories(cats);
        setBrands(brs);
        setConfig(cfg);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <div className="mb-10 rounded-xl overflow-hidden">
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
             
              <p className="mt-4 text-center text-base font-medium leading-relaxed tracking-tight text-neutral-200 sm:text-lg md:text-xl">
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