// //ref
// 'use client';

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useAuthStore } from '@/features/authentication/auth.store';
// import { SearchBar } from '@/components/catalog/SearchBar';
// import { CategoryList } from '@/components/catalog/CategoryList';
// import { Product, productsService } from '@/services/products.service';
// import { categoriesService, Category } from '@/services/categories.service';

// export default function DashboardPage() {
//   const token = useAuthStore((s) => s.accessToken)!;

//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [search, setSearch] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('Todos');

//   useEffect(() => {
//     if (!token) return;
//     Promise.all([
//       productsService.findAll(token),
//       categoriesService.findAll(token),
//     ])
//       .then(([prods, cats]) => {
//         setProducts(prods);
//         setCategories(cats);
//       })
//       .catch(() => setError('No se pudieron cargar los datos.'))
//       .finally(() => setLoading(false));
//   }, [token]);

//   const filtered = products.filter((product) => {
//     const matchCategory =
//       selectedCategory === 'Todos'
//         ? true
//         : product.categories.some(
//             (c) => c.category.name === selectedCategory,
//           );

//     const matchSearch = product.name
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     return matchCategory && matchSearch;
//   });

//   return (
//     <div className="relative">
//       <h1 className="text-xl font-bold mb-4">Catálogo</h1>

//       <SearchBar search={search} onSearchChange={setSearch} />

//       <CategoryList
//         categories={[
//           { id: 'all', name: 'Todos', slug: 'todos' },
//           ...categories.map((c) => ({
//             id: c.id,
//             name: c.name,
//             slug: c.slug,
//           })),
//         ]}
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//       />

//       {loading && (
//         <p className="text-neutral-400 text-sm mt-6">Cargando productos...</p>
//       )}

//       {error && (
//         <p className="text-red-400 text-sm mt-6">{error}</p>
//       )}

//       {!loading && !error && filtered.length === 0 && (
//         <p className="text-neutral-400 text-sm text-center mt-16">
//           No se encontraron productos.
//         </p>
//       )}

//       {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6"> */}
//       <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 lg:grid-cols-4">
//         {filtered.map((product) => (
//           <div
//             key={product.id}
//             className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900"
//           >
//             <div className="aspect-square bg-neutral-800 flex items-center justify-center">
//               {product.images[0] ? (
//                 <img
//                   src={product.images[0].url}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-neutral-600 text-xs">Sin imagen</span>
//               )}
//             </div>

//             <div className="p-3">
//               <p className="text-xs text-neutral-500 mb-1">
//                 {product.brand.name}
//               </p>
//               <h3 className="font-medium text-sm leading-tight">
//                 {product.name}
//               </h3>
//               <p className="mt-1 font-bold text-sm">
//                 ${Number(product.price).toLocaleString('es-AR')}
//               </p>

//               <div className="mt-3 flex gap-2">
//                 <Link
//                   href={`/dashboard/products/${product.id}/edit`}
//                   className="flex-1 rounded-lg border border-neutral-700 py-2 text-center text-xs hover:border-white transition-colors"
//                 >
//                   Editar
//                 </Link>
//                 <button className="flex-1 rounded-lg border border-red-900 py-2 text-xs text-red-400 hover:border-red-500 transition-colors">
//                   Eliminar
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Link
//         href="/dashboard/products/new"
//         className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-neutral-200 transition-colors z-50"
//       >
//         +
//       </Link>
//     </div>
//   );
// }

//soft delete y filtro inactivo y activo
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/authentication/auth.store';
import { SearchBar } from '@/components/catalog/SearchBar';
import { CategoryList } from '@/components/catalog/CategoryList';
import { Product, productsService } from '@/services/products.service';
import { categoriesService, Category } from '@/services/categories.service';

type StatusFilter = 'active' | 'inactive';

export default function DashboardPage() {
  const token = useAuthStore((s) => s.accessToken)!;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  async function loadProducts(status: StatusFilter) {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const prods = status === 'active'
        ? await productsService.findAllActive(token)
        : await productsService.findAllInactiveAndDeleted(token);
      setProducts(prods);
    } catch {
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial — categorías + productos activos
  useEffect(() => {
    if (!token) return;
    categoriesService.findAll(token).then(setCategories).catch(() => {});
    loadProducts('active');
  }, [token]);

  function handleStatusChange(status: StatusFilter) {
    setStatusFilter(status);
    setSelectedCategory('Todos');
    setSearch('');
    loadProducts(status);
  }

  // async function handleDelete(id: string) {
  //   if (!confirm('¿Eliminás este producto?')) return;
  //   try {
  //     await productsService.remove(id, token);
  //     loadProducts(statusFilter);
  //   } catch {
  //     alert('No se pudo eliminar el producto.');
  //   }
  // }

  async function handleDelete(id: string, isDeleted: boolean) {
  if (isDeleted) {
    if (!confirm('¿Restaurás este producto?')) return;
    try {
      await productsService.restore(id, token);
      loadProducts(statusFilter);
    } catch {
      alert('No se pudo restaurar el producto.');
    }
  } else {
    if (!confirm('¿Eliminás este producto?')) return;
    try {
      await productsService.remove(id, token);
      loadProducts(statusFilter);
    } catch {
      alert('No se pudo eliminar el producto.');
    }
  }
}

  const filtered = products.filter((product) => {
    const matchCategory =
      selectedCategory === 'Todos'
        ? true
        : product.categories.some(
            (c) => c.category.name === selectedCategory,
          );
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="relative">

      {/* Header con filtro de estado */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Catálogo</h1>
        <div className="flex gap-1">
          <button
            onClick={() => handleStatusChange('active')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => handleStatusChange('inactive')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>

      <SearchBar search={search} onSearchChange={setSearch} />

      <CategoryList
        categories={[
          { id: 'all', name: 'Todos', slug: 'todos' },
          ...categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
          })),
        ]}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading && (
        <p className="text-neutral-400 text-sm mt-6">Cargando productos...</p>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-6">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-neutral-400 text-sm text-center mt-16">
          No se encontraron productos.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => {
          const isDeleted = product.deletedAt !== null;
          return (
            <div
              key={product.id}
              className={`rounded-xl border overflow-hidden bg-neutral-900 ${
                isDeleted
                  ? 'border-red-900 opacity-60'
                  : 'border-neutral-800'
              }`}
            >
              <div className="aspect-square bg-neutral-800 flex items-center justify-center relative">
                {product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-neutral-600 text-xs">Sin imagen</span>
                )}
                {isDeleted && (
                  <span className="absolute top-2 left-2 bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full">
                    Eliminado
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="text-xs text-neutral-500 mb-1">
                  {product.brand.name}
                </p>
                <h3 className={`font-medium text-sm leading-tight ${isDeleted ? 'line-through text-neutral-500' : ''}`}>
                  {product.name}
                </h3>
                <p className="mt-1 font-bold text-sm">
                  ${Number(product.price).toLocaleString('es-AR')}
                </p>

                <div className="mt-3 flex gap-2">
                  {!isDeleted && (
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="flex-1 rounded-lg border border-neutral-700 py-2 text-center text-xs hover:border-white transition-colors"
                    >
                      Editar
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(product.id, isDeleted)}
                    className={`flex-1 rounded-lg border py-2 text-xs transition-colors ${
                      isDeleted
                        ? 'border-neutral-700 text-neutral-400 hover:border-white'
                        : 'border-red-900 text-red-400 hover:border-red-500'
                    }`}
                  >
                    {isDeleted ? 'Restaurar' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/dashboard/products/new"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-neutral-200 transition-colors z-50"
      >
        +
      </Link>
    </div>
  );
}
