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

type BrandsSectionProps = {
  brands: CatalogBrand[];
  title?: string;
};

export function BrandsSection({
  brands,
  title = 'Nuestras marcas',
}: BrandsSectionProps) {
  if (brands.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/catalogo?marca=${brand.slug}`}
            className="flex h-16 min-w-28 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-4 transition-colors hover:border-neutral-600"
          >
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
               className="max-h-8 max-w-24 sm:max-h-10 sm:max-w-32 md:max-h-12 md:max-w-40 object-contain"
              />
            ) : (
              <span
                className={`text-base font-extrabold tracking-wide ${colorFor(brand.name)}`}
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