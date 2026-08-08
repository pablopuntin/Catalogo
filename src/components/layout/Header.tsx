// //ref
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { BusinessConfig } from '@/services/business-config.service';
// import { CatalogCategory } from '@/types/catalog';

// type HeaderProps = {
//   count: number;
//   config: BusinessConfig | null;
//   onCartOpen: () => void;
//   categories: CatalogCategory[];
//   selectedCategory: string;
//   onSelectCategory: (category: string) => void;
//   search: string;
//   onSearchChange: (value: string) => void;
// };

// export function Header({
//   count,
//   config,
//   onCartOpen,
//   categories,
//   selectedCategory,
//   onSelectCategory,
//   search,
//   onSearchChange,
// }: HeaderProps) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
//       {/* Fila principal */}
//       <div className="flex items-center justify-between p-4">
//         {/* Menú ☰ */}
//         <button
//           onClick={() => setMenuOpen(true)}
//           aria-label="Abrir menú"
//           className="text-white text-xl leading-none"
//         >
//           ☰
//         </button>

//         {/* Logo + nombre (vuelve al inicio) */}
//         <Link
//           href="/"
//           className="flex min-w-0 items-center gap-2 font-bold text-white"
//         >
//           {config?.logoUrl && (
//             <img
//               src={config.logoUrl}
//               alt={config.businessName ?? 'Logo'}
//               className="h-8 w-auto object-contain"
//             />
//           )}
//           <span className="truncate">
//             {config?.businessName ?? 'Catálogo'}
//           </span>
//         </Link>

//         {/* Catálogo (md+) + Lupa + Carrito */}
//         <div className="flex items-center gap-3">
//           <Link
//             href="/catalogo"
//             className="hidden md:inline text-sm font-medium text-neutral-300 hover:text-white transition-colors"
//           >
//             Catálogo
//           </Link>
//           <button
//             onClick={() => setSearchOpen((v) => !v)}
//             aria-label="Buscar"
//             className="text-white text-lg leading-none"
//           >
//             🔍
//           </button>
//           <button
//             onClick={onCartOpen}
//             className="text-sm font-medium text-white"
//           >
//             🛒 {count}
//           </button>
//         </div>
//       </div>

//       {/* Buscador desplegable */}
//       {searchOpen && (
//         <div className="px-4 pb-3">
//           <input
//             type="text"
//             placeholder="Buscar productos..."
//             value={search}
//             onChange={(e) => onSearchChange(e.target.value)}
//             autoFocus
//             className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-neutral-500"
//           />
//         </div>
//       )}

//       {/* Panel del menú ☰ */}
//       {menuOpen && (
//         <div className="fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/60"
//             onClick={() => setMenuOpen(false)}
//           />
//           <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto border-r border-neutral-800 bg-neutral-950 p-4">
//             <div className="flex items-center justify-between">
//               <span className="font-bold text-white">Menú</span>
//               <button
//                 onClick={() => setMenuOpen(false)}
//                 aria-label="Cerrar menú"
//                 className="text-lg text-neutral-400 hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>

//             <Link
//               href="/login"
//               className="mt-4 block text-sm text-neutral-300 hover:text-white transition-colors"
//             >
//               Acceder
//             </Link>

//             <button
//               onClick={() => {
//                 setMenuOpen(false);
//                 document
//                   .getElementById('footer')
//                   ?.scrollIntoView({ behavior: 'smooth' });
//               }}
//               className="mt-2 block w-full text-left text-sm text-neutral-300 hover:text-white transition-colors"
//             >
//               Dónde estamos
//             </button>

//             <div className="mt-4 flex flex-col gap-1 border-t border-neutral-800 pt-4">
//               <span className="mb-1 text-xs uppercase text-neutral-500">
//                 Categorías
//               </span>

//               {/* Catálogo — en el lugar de "Todos" (solo mobile; en md+ está en la barra) */}
//               <Link
//                 href="/catalogo"
//                 onClick={() => setMenuOpen(false)}
//                 className="rounded-lg px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 transition-colors md:hidden"
//               >
//                 Catálogo
//               </Link>

//               {categories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => {
//                     onSelectCategory(category.name);
//                     setMenuOpen(false);
//                   }}
//                   className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
//                     selectedCategory === category.name
//                       ? 'bg-white text-black'
//                       : 'text-neutral-300 hover:bg-neutral-800'
//                   }`}
//                 >
//                   {category.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

//ref
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BusinessConfig } from '@/services/business-config.service';
import { CatalogCategory } from '@/types/catalog';

type HeaderProps = {
  count: number;
  config: BusinessConfig | null;
  onCartOpen: () => void;
  categories: CatalogCategory[];
};

export function Header({
  count,
  config,
  onCartOpen,
  categories,
}: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('categoria');

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');

  function submitSearch() {
    const q = term.trim();
    setSearchOpen(false);
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo');
  }

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          className="text-white text-xl leading-none"
        >
          ☰
        </button>

        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-bold text-white"
        >
          {config?.logoUrl && (
            <img
              src={config.logoUrl}
              alt={config.businessName ?? 'Logo'}
              className="h-8 w-auto object-contain"
            />
          )}
          <span className="truncate">
            {config?.businessName ?? 'Catálogo'}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/catalogo"
            className="hidden md:inline text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Catálogo
          </Link>
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Buscar"
            className="text-white text-lg leading-none"
          >
            🔍
          </button>
          <button
            onClick={onCartOpen}
            className="text-sm font-medium text-white"
          >
            🛒 {count}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitSearch();
            }}
            autoFocus
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-neutral-500"
          />
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto border-r border-neutral-800 bg-neutral-950 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Menú</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="text-lg text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <Link
              href="/catalogo?oferta=1"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              🔥 Ofertas
            </Link>

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 block text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Acceder
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                document
                  .getElementById('footer')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 block w-full text-left text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Dónde estamos
            </button>

            <div className="mt-4 flex flex-col gap-1 border-t border-neutral-800 pt-4">
              <span className="mb-1 text-xs uppercase text-neutral-500">
                Categorías
              </span>

              <Link
                href="/catalogo"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 transition-colors md:hidden"
              >
                Catálogo
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogo?categoria=${category.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === category.slug
                      ? 'bg-white text-black'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}