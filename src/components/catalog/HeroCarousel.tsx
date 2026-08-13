'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroImage } from '@/services/business-config.service';

const AUTO_MS = 4000;

type HeroCarouselProps = {
  images: HeroImage[];
  alt?: string;
};

export function HeroCarousel({ images, alt = '' }: HeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, images.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
    }
  }, [index]);

  function syncIndex() {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  if (images.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={syncIndex}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-xl"
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="aspect-video w-full shrink-0 snap-center bg-neutral-900"
          >
            <img
              src={img.url}
              alt={alt}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
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