'use client';

import { useEffect, useState } from 'react';
import { HeroImage } from '@/services/business-config.service';

const AUTO_MS = 4000;

type HeroCarouselProps = {
  images: HeroImage[];
  alt?: string;
};

export function HeroCarousel({ images, alt = '' }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ventana */}
      <div className="overflow-hidden rounded-xl">
        {/* Carril que se corre */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="h-48 w-full shrink-0 bg-neutral-900 sm:h-64 md:h-80 lg:h-96"
            >
              <img
                src={img.url}
                alt={alt}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndex(i)}
              aria-label={`Imagen ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-5 bg-white' : 'w-2 bg-neutral-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}