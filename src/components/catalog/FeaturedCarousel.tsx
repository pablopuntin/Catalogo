'use client';

import { useEffect, useRef, useState } from 'react';
import { CatalogProduct } from '@/types/catalog';
import { ProductCard } from './ProductCard';

type FeaturedCarouselProps = {
  products: CatalogProduct[];
  onAdd: (product: CatalogProduct) => void;
  title?: string;
};

// Cada cuánto avanza solo (en milisegundos). 2000 = 2 segundos.
const AUTO_MS = 3000;

export function FeaturedCarousel({
  products,
  onAdd,
  title = 'Nuestros destacados de la semana',
}: FeaturedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [paused, setPaused] = useState(false);

  // ¿El contenido se pasa del ancho? (si no, no hay nada que deslizar)
  useEffect(() => {
    function check() {
      const el = trackRef.current;
      if (el) setOverflow(el.scrollWidth > el.clientWidth + 4);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [products.length]);

  // Avance automático (solo si hay overflow y no está pausado)
  useEffect(() => {
    if (!overflow || paused || products.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [overflow, paused, products.length]);

  // Al cambiar el índice, centrar esa card dentro del carrusel
  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[index];
    if (track && item) {
      const left =
        item.offsetLeft - (track.clientWidth - item.clientWidth) / 2;
      track.scrollTo({ left, behavior: 'smooth' });
    }
  }, [index]);

  // Al soltar/salir, sincronizar el punto con lo que quedó a la vista
  function syncIndexFromScroll() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const c = el.offsetLeft + el.clientWidth / 2;
      const d = Math.abs(c - center);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setIndex(nearest);
  }

  if (products.length === 0) return null;

  return (
    <section
      className="mb-10 sm:mb-14 md:mb-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        syncIndexFromScroll();
        setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        syncIndexFromScroll();
        setPaused(false);
      }}
    >
      <h2 className="mb-8 mt-5 text-center text-2xl font-bold tracking-tight text-white sm:mb-6 sm:text-3xl md:mb-8 md:text-4xl">
        {title}
      </h2>

      <div
        ref={trackRef}
        className="no-scrollbar relative flex gap-3 overflow-x-auto pb-2 [justify-content:safe_center]"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="w-[calc(50%-0.375rem)] shrink-0 md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)]"
          >
            <ProductCard product={product} onAdd={() => onAdd(product)} />
          </div>
        ))}
      </div>

      {/* Puntitos — solo cuando hay algo para deslizar */}
      {overflow && products.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {products.map((product, i) => (
            <button
              key={product.id}
              onClick={() => setIndex(i)}
              aria-label={`Ir al destacado ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-5 bg-white' : 'w-2 bg-neutral-600'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}