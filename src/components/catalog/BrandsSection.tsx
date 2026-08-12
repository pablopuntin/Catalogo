//ref con carrusel
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CatalogBrand } from '@/types/catalog';

const COLORS = [
  'text-rose-400',
  'text-sky-400',
  'text-amber-400',
  'text-emerald-400',
  'text-violet-400',
  'text-orange-400',
  'text-cyan-400',
  'text-lime-400',
];

function colorFor(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

// Cada cuánto avanza de página (ms)
const AUTO_MS = 2000;

type BrandsSectionProps = {
  brands: CatalogBrand[];
  title?: string;
};

export function BrandsSection({
  brands,
  title = 'Nuestras marcas',
}: BrandsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    function check() {
      const el = trackRef.current;
      if (el) setOverflow(el.scrollWidth > el.clientWidth + 4);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [brands.length]);

  useEffect(() => {
    if (!overflow || paused) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const next = track.scrollLeft + track.clientWidth;

      track.scrollTo({
        left: next > maxScroll - 4 ? 0 : next,
        behavior: 'smooth',
      });
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [overflow, paused]);

  if (brands.length === 0) return null;

  return (
    <section
      className="mb-10 sm:mb-14 md:mb-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <h2 className="mb-5 text-center text-2xl font-bold tracking-tight text-white sm:mb-6 sm:text-3xl md:mb-8 md:text-4xl">
        {title}
      </h2>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-3 overflow-x-auto pb-2 [justify-content:safe_center]"
      >
        {brands.map((brand, i) => (
          <Link
            key={brand.id}
            href={`/catalogo?marca=${brand.slug}`}
            className="flex h-20 w-[calc(33.333%-0.5rem)] shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 transition-colors hover:border-neutral-600 sm:h-24 md:h-28 md:w-[calc(25%-0.5625rem)]"
          >
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="max-h-12 max-w-full object-contain sm:max-h-16 md:max-h-20"
              />
            ) : (
              <span
                className={`text-center text-sm font-extrabold tracking-wide sm:text-base md:text-lg ${colorFor(brand.name)}`}
              >
                {brand.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}