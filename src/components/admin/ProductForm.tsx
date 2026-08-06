// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/features/authentication/auth.store';
// import { productsService } from '@/services/products.service';
// import { categoriesService, Category } from '@/services/categories.service';
// import { brandsService, Brand } from '@/services/brands.service';
// import { ApiException } from '@/services/api';

// type ProductFormProps = {
//   productId?: string;
// };

// export function ProductForm({ productId }: ProductFormProps) {
//   const router = useRouter();
//   const token = useAuthStore((s) => s.accessToken)!;
//   const isEditing = !!productId;

//   // Campos del form
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [visible, setVisible] = useState(true);

//   // Categorías
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [categoryInput, setCategoryInput] = useState('');
//   const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<{ id?: string; name: string }[]>([]);
//   const [categoryFocused, setCategoryFocused] = useState(false);

//   // Marcas
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [brandInput, setBrandInput] = useState('');
//   const [brandSuggestions, setBrandSuggestions] = useState<Brand[]>([]);
//   const [selectedBrand, setSelectedBrand] = useState<{ id?: string; name: string } | null>(null);
//   const [brandFocused, setBrandFocused] = useState(false);

//   // Estado general
//   const [loadingData, setLoadingData] = useState(isEditing);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Cargar datos
//   useEffect(() => {
//     if (!token) return;

//     if (isEditing) {
//       // Modo edición — cargar producto + categorías + marcas
//       Promise.all([
//         productsService.findOne(productId, token),
//         categoriesService.findAll(token),
//         brandsService.findAll(token),
//       ])
//         .then(([product, cats, brs]) => {
//           setName(product.name);
//           setDescription(product.description ?? '');
//           setPrice(product.price);
//           setVisible(product.active);
//           setImageUrl(product.images[0]?.url ?? '');
//           setSelectedCategories(
//             product.categories.map((c) => ({
//               id: c.category.id,
//               name: c.category.name.toUpperCase(),
//             })),
//           );
//           setSelectedBrand({
//             id: product.brand.id,
//             name: product.brand.name.toUpperCase(),
//           });
//           setCategories(cats);
//           setBrands(brs);
//         })
//         .catch(() => setError('No se pudo cargar el producto.'))
//         .finally(() => setLoadingData(false));
//     } else {
//       // Modo creación — solo cargar categorías + marcas
//       Promise.all([
//         categoriesService.findAll(token),
//         brandsService.findAll(token),
//       ])
//         .then(([cats, brs]) => {
//           setCategories(cats);
//           setBrands(brs);
//         })
//         .catch(() => {});
//     }
//   }, [token, productId, isEditing]);

//   // Autocomplete categorías
//   useEffect(() => {
//     if (!categoryInput.trim()) {
//       setCategorySuggestions(
//         categories.filter(
//           (c) => !selectedCategories.find((s) => s.name === c.name.toUpperCase()),
//         ),
//       );
//       return;
//     }
//     const q = categoryInput.toUpperCase();
//     setCategorySuggestions(
//       categories.filter((c) =>
//         c.name.toUpperCase().includes(q) &&
//         !selectedCategories.find((s) => s.name === c.name.toUpperCase()),
//       ),
//     );
//   }, [categoryInput, categories, selectedCategories]);

//   // Autocomplete marcas
//   useEffect(() => {
//     if (!brandInput.trim()) {
//       setBrandSuggestions(brands);
//       return;
//     }
//     const q = brandInput.toUpperCase();
//     setBrandSuggestions(
//       brands.filter((b) => b.name.toUpperCase().includes(q)),
//     );
//   }, [brandInput, brands]);

//   function addCategory(cat?: Category) {
//     const catName = cat
//       ? cat.name.toUpperCase()
//       : categoryInput.trim().toUpperCase();

//     if (!catName) return;
//     if (selectedCategories.find((s) => s.name === catName)) return;

//     setSelectedCategories((prev) => [
//       ...prev,
//       cat ? { id: cat.id, name: catName } : { name: catName },
//     ]);
//     setCategoryInput('');
//   }

//   function removeCategory(catName: string) {
//     setSelectedCategories((prev) => prev.filter((c) => c.name !== catName));
//   }

//   function selectBrand(brand?: Brand) {
//     const brandName = brand
//       ? brand.name.toUpperCase()
//       : brandInput.trim().toUpperCase();

//     if (!brandName) return;
//     setSelectedBrand(brand ? { id: brand.id, name: brandName } : { name: brandName });
//     setBrandInput('');
//     setBrandFocused(false);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');

//     if (selectedCategories.length === 0) {
//       setError('Seleccioná al menos una categoría.');
//       return;
//     }

//     if (!selectedBrand) {
//       setError('Seleccioná o ingresá una marca.');
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       categories: selectedCategories.map((c) =>
//         c.id ? { id: c.id } : { name: c.name },
//       ),
//       brand: selectedBrand.id
//         ? { id: selectedBrand.id }
//         : { name: selectedBrand.name },
//       product: {
//         name: name.trim(),
//         description: description.trim() || undefined,
//         price: Number(price),
//         active: visible,
//         imageUrl: imageUrl.trim() || undefined,
//       },
//     };

//     try {
//       if (isEditing) {
//         await productsService.updateCatalog(productId, payload, token);
//       } else {
//         await productsService.create(payload, token);
//       }
//       router.push('/dashboard');
//     } catch (err) {
//       if (err instanceof ApiException) {
//         setError(err.message);
//       } else {
//         setError('Error al guardar el producto.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loadingData) {
//     return (
//       <div className="flex items-center justify-center py-16">
//         <p className="text-neutral-400 text-sm">Cargando producto...</p>
//       </div>
//     );
//   }

//   if (error && !name && isEditing) {
//     return (
//       <div className="flex items-center justify-center py-16">
//         <p className="text-red-400 text-sm">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-lg mx-auto">

//       <div className="flex items-center gap-3 mb-6">
//         <button
//           onClick={() => router.back()}
//           className="text-neutral-400 hover:text-white text-sm"
//         >
//           ← Volver
//         </button>
//         <h1 className="text-xl font-bold">
//           {isEditing ? 'Editar producto' : 'Nuevo producto'}
//         </h1>
//       </div>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-5">

//         {/* Nombre */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-neutral-400">
//             Nombre <span className="text-red-400">*</span>
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             placeholder="Ej: Mate Stanley 1.2L"
//             className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
//           />
//         </div>

//         {/* Descripción */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-neutral-400">Descripción</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Descripción del producto..."
//             rows={3}
//             className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500 resize-none"
//           />
//         </div>

//         {/* Precio */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-neutral-400">
//             Precio <span className="text-red-400">*</span>
//           </label>
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//             min={0}
//             step={0.01}
//             placeholder="0.00"
//             className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
//           />
//         </div>

//         {/* Categorías */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-neutral-400">
//             Categorías <span className="text-red-400">*</span>
//           </label>

//           {selectedCategories.length > 0 && (
//             <div className="flex flex-wrap gap-2 mb-2">
//               {selectedCategories.map((cat) => (
//                 <span
//                   key={cat.name}
//                   className="flex items-center gap-1 rounded-full bg-neutral-800 border border-neutral-700 px-3 py-1 text-xs text-white"
//                 >
//                   {cat.name}
//                   <button
//                     type="button"
//                     onClick={() => removeCategory(cat.name)}
//                     className="text-neutral-500 hover:text-white ml-1"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}

//           <div className="relative">
//             <input
//               type="text"
//               value={categoryInput}
//               onChange={(e) => setCategoryInput(e.target.value)}
//               onFocus={() => setCategoryFocused(true)}
//               onBlur={() => {
//                 setTimeout(() => {
//                   setCategoryFocused(false);
//                   if (categoryInput.trim()) addCategory();
//                 }, 150);
//               }}
//               placeholder="Buscar o crear categoría..."
//               className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
//             />

//             {categoryFocused && categorySuggestions.length > 0 && (
//               <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden">
//                 {categorySuggestions.map((cat) => (
//                   <button
//                     key={cat.id}
//                     type="button"
//                     onClick={() => addCategory(cat)}
//                     className="w-full px-4 py-3 text-left text-sm text-white hover:bg-neutral-800 transition-colors"
//                   >
//                     {cat.name.toUpperCase()}
//                   </button>
//                 ))}
//                 {categoryInput.trim() &&
//                   !categorySuggestions.find(
//                     (c) => c.name.toUpperCase() === categoryInput.toUpperCase(),
//                   ) && (
//                     <button
//                       type="button"
//                       onClick={() => addCategory()}
//                       className="w-full px-4 py-3 text-left text-sm text-neutral-400 hover:bg-neutral-800 border-t border-neutral-800"
//                     >
//                       + Crear "{categoryInput.toUpperCase()}"
//                     </button>
//                   )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Marca */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-neutral-400">
//             Marca <span className="text-red-400">*</span>
//           </label>

//           {selectedBrand ? (
//             <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3">
//               <span className="text-sm text-white">{selectedBrand.name}</span>
//               <button
//                 type="button"
//                 onClick={() => setSelectedBrand(null)}
//                 className="text-neutral-500 hover:text-white text-xs"
//               >
//                 Cambiar
//               </button>
//             </div>
//           ) : (
//             <div className="relative">
//               <input
//                 type="text"
//                 value={brandInput}
//                 onChange={(e) => setBrandInput(e.target.value)}
//                 onFocus={() => setBrandFocused(true)}
//                 onBlur={() => {
//                   setTimeout(() => {
//                     setBrandFocused(false);
//                     if (brandInput.trim()) selectBrand();
//                   }, 150);
//                 }}
//                 placeholder="Buscar o crear marca..."
//                 className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
//               />

//               {brandFocused && brandSuggestions.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden">
//                   {brandSuggestions.map((brand) => (
//                     <button
//                       key={brand.id}
//                       type="button"
//                       onClick={() => selectBrand(brand)}
//                       className="w-full px-4 py-3 text-left text-sm text-white hover:bg-neutral-800 transition-colors"
//                     >
//                       {brand.name.toUpperCase()}
//                     </button>
//                   ))}
//                   {brandInput.trim() &&
//                     !brandSuggestions.find(
//                       (b) => b.name.toUpperCase() === brandInput.toUpperCase(),
//                     ) && (
//                       <button
//                         type="button"
//                         onClick={() => selectBrand()}
//                         className="w-full px-4 py-3 text-left text-sm text-neutral-400 hover:bg-neutral-800 border-t border-neutral-800"
//                       >
//                         + Crear "{brandInput.toUpperCase()}"
//                       </button>
//                     )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Imagen URL */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm text-neutral-400">
//             Imagen <span className="text-neutral-600 text-xs">(opcional)</span>
//           </label>
//           <input
//             type="url"
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             placeholder="https://..."
//             className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
//           />
//         </div>

//         {/* Visible */}
//         <div className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-white">
//                 Visible en el catálogo
//               </p>
//               {!visible && (
//                 <p className="text-xs text-yellow-500 mt-1">
//                   ⚠️ Este producto no será visible para tus clientes
//                 </p>
//               )}
//             </div>
//             <button
//               type="button"
//               onClick={() => setVisible(!visible)}
//               className={`relative w-12 h-6 rounded-full transition-colors ${
//                 visible ? 'bg-white' : 'bg-neutral-700'
//               }`}
//             >
//               <span
//                 className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
//                   visible ? 'translate-x-7 bg-black' : 'translate-x-1 bg-neutral-400'
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <p className="text-sm text-red-400 text-center">{error}</p>
//         )}

//         {/* Acciones */}
//         <div className="flex gap-3 pt-2 pb-8">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="flex-1 rounded-lg border border-neutral-700 py-3 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 rounded-lg bg-white text-black py-3 text-sm font-semibold disabled:opacity-50"
//           >
//             {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Guardar'}
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// }


//ref para imagen en cloudinary
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/authentication/auth.store';
import { productsService } from '@/services/products.service';
import { categoriesService, Category } from '@/services/categories.service';
import { brandsService, Brand } from '@/services/brands.service';
import { productImagesService } from '@/services/product-images.service';
import { ApiException } from '@/services/api';

type ProductFormProps = {
  productId?: string;
};

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken)!;
  const isEditing = !!productId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Campos del form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [visible, setVisible] = useState(true);

  // Imagen
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Categorías
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{ id?: string; name: string }[]>([]);
  const [categoryFocused, setCategoryFocused] = useState(false);

  // Marcas
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandInput, setBrandInput] = useState('');
  const [brandSuggestions, setBrandSuggestions] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<{ id?: string; name: string } | null>(null);
  const [brandFocused, setBrandFocused] = useState(false);

  // Estado general
  const [loadingData, setLoadingData] = useState(isEditing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    if (isEditing) {
      Promise.all([
        productsService.findOne(productId, token),
        categoriesService.findAll(token),
        brandsService.findAll(token),
      ])
        .then(([product, cats, brs]) => {
          setName(product.name);
          setDescription(product.description ?? '');
          setPrice(product.price);
          setVisible(product.active);

          const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
          if (primaryImage) {
            setCurrentImageUrl(primaryImage.url);
            setCurrentImageId(primaryImage.id);
          }

          setSelectedCategories(
            product.categories.map((c) => ({
              id: c.category.id,
              name: c.category.name.toUpperCase(),
            })),
          );
          setSelectedBrand({
            id: product.brand.id,
            name: product.brand.name.toUpperCase(),
          });
          setCategories(cats);
          setBrands(brs);
        })
        .catch(() => setError('No se pudo cargar el producto.'))
        .finally(() => setLoadingData(false));
    } else {
      Promise.all([
        categoriesService.findAll(token),
        brandsService.findAll(token),
      ])
        .then(([cats, brs]) => {
          setCategories(cats);
          setBrands(brs);
        })
        .catch(() => {});
    }
  }, [token, productId, isEditing]);

  // Autocomplete categorías
  useEffect(() => {
    if (!categoryInput.trim()) {
      setCategorySuggestions(
        categories.filter(
          (c) => !selectedCategories.find((s) => s.name === c.name.toUpperCase()),
        ),
      );
      return;
    }
    const q = categoryInput.toUpperCase();
    setCategorySuggestions(
      categories.filter((c) =>
        c.name.toUpperCase().includes(q) &&
        !selectedCategories.find((s) => s.name === c.name.toUpperCase()),
      ),
    );
  }, [categoryInput, categories, selectedCategories]);

  // Autocomplete marcas
  useEffect(() => {
    if (!brandInput.trim()) {
      setBrandSuggestions(brands);
      return;
    }
    const q = brandInput.toUpperCase();
    setBrandSuggestions(
      brands.filter((b) => b.name.toUpperCase().includes(q)),
    );
  }, [brandInput, brands]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  }

  function addCategory(cat?: Category) {
    const catName = cat
      ? cat.name.toUpperCase()
      : categoryInput.trim().toUpperCase();

    if (!catName) return;
    if (selectedCategories.find((s) => s.name === catName)) return;

    setSelectedCategories((prev) => [
      ...prev,
      cat ? { id: cat.id, name: catName } : { name: catName },
    ]);
    setCategoryInput('');
  }

  function removeCategory(catName: string) {
    setSelectedCategories((prev) => prev.filter((c) => c.name !== catName));
  }

  function selectBrand(brand?: Brand) {
    const brandName = brand
      ? brand.name.toUpperCase()
      : brandInput.trim().toUpperCase();

    if (!brandName) return;
    setSelectedBrand(brand ? { id: brand.id, name: brandName } : { name: brandName });
    setBrandInput('');
    setBrandFocused(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (selectedCategories.length === 0) {
      setError('Seleccioná al menos una categoría.');
      return;
    }

    if (!selectedBrand) {
      setError('Seleccioná o ingresá una marca.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        categories: selectedCategories.map((c) =>
          c.id ? { id: c.id } : { name: c.name },
        ),
        brand: selectedBrand.id
          ? { id: selectedBrand.id }
          : { name: selectedBrand.name },
        product: {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          active: visible,
        },
      };

      let savedProductId = productId;

      if (isEditing) {
        await productsService.updateCatalog(productId, payload, token);
      } else {
        const created = await productsService.create(payload, token);
        savedProductId = created.id;
      }

      // Subir imagen si se seleccionó una
      if (selectedFile && savedProductId) {
        await productImagesService.upload(
          savedProductId,
          selectedFile,
          true,
          token,
        );
      }

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al guardar el producto.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-neutral-400 text-sm">Cargando producto...</p>
      </div>
    );
  }

  if (error && !name && isEditing) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const displayImage = previewUrl ?? currentImageUrl;

  return (
    <div className="max-w-lg mx-auto">

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-neutral-400 hover:text-white text-sm"
        >
          ← Volver
        </button>
        <h1 className="text-xl font-bold">
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Heladera Exhibidora 200L"
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del producto..."
            rows={3}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500 resize-none"
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">
            Precio <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            step={0.01}
            placeholder="0.00"
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        {/* Categorías */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">
            Categorías <span className="text-red-400">*</span>
          </label>

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedCategories.map((cat) => (
                <span
                  key={cat.name}
                  className="flex items-center gap-1 rounded-full bg-neutral-800 border border-neutral-700 px-3 py-1 text-xs text-white"
                >
                  {cat.name}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat.name)}
                    className="text-neutral-500 hover:text-white ml-1"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onFocus={() => setCategoryFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setCategoryFocused(false);
                  if (categoryInput.trim()) addCategory();
                }, 150);
              }}
              placeholder="Buscar o crear categoría..."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
            />

            {categoryFocused && categorySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden">
                {categorySuggestions.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => addCategory(cat)}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-neutral-800 transition-colors"
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
                {categoryInput.trim() &&
                  !categorySuggestions.find(
                    (c) => c.name.toUpperCase() === categoryInput.toUpperCase(),
                  ) && (
                    <button
                      type="button"
                      onClick={() => addCategory()}
                      className="w-full px-4 py-3 text-left text-sm text-neutral-400 hover:bg-neutral-800 border-t border-neutral-800"
                    >
                      + Crear "{categoryInput.toUpperCase()}"
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Marca */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">
            Marca <span className="text-red-400">*</span>
          </label>

          {selectedBrand ? (
            <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3">
              <span className="text-sm text-white">{selectedBrand.name}</span>
              <button
                type="button"
                onClick={() => setSelectedBrand(null)}
                className="text-neutral-500 hover:text-white text-xs"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                onFocus={() => setBrandFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setBrandFocused(false);
                    if (brandInput.trim()) selectBrand();
                  }, 150);
                }}
                placeholder="Buscar o crear marca..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500"
              />

              {brandFocused && brandSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden">
                  {brandSuggestions.map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => selectBrand(brand)}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-neutral-800 transition-colors"
                    >
                      {brand.name.toUpperCase()}
                    </button>
                  ))}
                  {brandInput.trim() &&
                    !brandSuggestions.find(
                      (b) => b.name.toUpperCase() === brandInput.toUpperCase(),
                    ) && (
                      <button
                        type="button"
                        onClick={() => selectBrand()}
                        className="w-full px-4 py-3 text-left text-sm text-neutral-400 hover:bg-neutral-800 border-t border-neutral-800"
                      >
                        + Crear "{brandInput.toUpperCase()}"
                      </button>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Imagen */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">
            Imagen <span className="text-neutral-600 text-xs">(opcional)</span>
          </label>

          {/* Preview */}
          {displayImage && (
            <div className="relative aspect-square w-full max-w-xs rounded-xl overflow-hidden bg-neutral-800">
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  if (!previewUrl) setCurrentImageUrl(null);
                }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black"
              >
                ✕
              </button>
            </div>
          )}

          {/* Selector de archivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-neutral-700 border-dashed bg-neutral-900 px-4 py-4 text-sm text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors text-center"
          >
            {displayImage ? '🔄 Cambiar imagen' : '📷 Elegir imagen'}
            <span className="block text-xs text-neutral-600 mt-1">
              JPG, PNG o WebP — máx. 5MB
            </span>
          </button>
        </div>

        {/* Visible */}
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Visible en el catálogo
              </p>
              {!visible && (
                <p className="text-xs text-yellow-500 mt-1">
                  ⚠️ Este producto no será visible para tus clientes
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                visible ? 'bg-white' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                  visible ? 'translate-x-7 bg-black' : 'translate-x-1 bg-neutral-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-neutral-700 py-3 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-white text-black py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>

      </form>
    </div>
  );
}