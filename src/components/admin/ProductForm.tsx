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
 
  // Detalles técnicos
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  // Promoción
  const [featured, setFeatured] = useState(false);
  const [discountType, setDiscountType] = useState<'' | 'PERCENTAGE' | 'FIXED' | 'TWO_FOR_ONE'>('');
  const [discountValue, setDiscountValue] = useState('');

 // Imágenes
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

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
          setFeatured(product.featured ?? false);
          setSpecs(
            (product.specs ?? []).map((s) => ({
              label: s.label,
              value: s.value,
            })),
          );
          setDiscountType(product.discountType ?? '');
          setDiscountValue(
            product.discountValue != null ? String(product.discountValue) : '',
          );

         setExistingImages(
            product.images.map((i) => ({ id: i.id, url: i.url })),
          );

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
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const tooBig = files.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) {
      setError('Cada imagen debe pesar menos de 5MB.');
      return;
    }

    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    setError('');

    // Permite volver a elegir el mismo archivo
    e.target.value = '';
  }

  function removeExistingImage(id: string) {
    setExistingImages((prev) => prev.filter((i) => i.id !== id));
    setRemovedImageIds((prev) => [...prev, id]);
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
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
          featured,
          specs: specs.filter((s) => s.label.trim() && s.value.trim()),
          discountType: discountType === '' ? null : discountType,
          discountValue:
            discountType === 'PERCENTAGE' || discountType === 'FIXED'
              ? Number(discountValue)
              : null,
        },
      };

      let savedProductId = productId;

      if (isEditing) {
        await productsService.updateCatalog(productId, payload, token);
      } else {
        const created = await productsService.create(payload, token);
        savedProductId = created.id;
      }

      if (savedProductId) {
        // Borrar las que se sacaron
        for (const imageId of removedImageIds) {
          await productImagesService
            .remove(savedProductId, imageId, token)
            .catch(() => {});
        }

        // Subir las nuevas
        for (let i = 0; i < newFiles.length; i++) {
          const isPrimary = existingImages.length === 0 && i === 0;
          await productImagesService.upload(
            savedProductId,
            newFiles[i],
            isPrimary,
            token,
          );
        }
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

       {/* Imágenes */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">
            Imágenes <span className="text-neutral-600 text-xs">(opcional)</span>
          </label>

          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {existingImages.map((img, i) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-neutral-800"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {newPreviews.map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-green-600"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] text-white">
                    Nueva
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-4 py-4 text-center text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
          >
            📷 Agregar imágenes
            <span className="mt-1 block text-xs text-neutral-600">
              JPG, PNG o WebP — máx. 5MB cada una
            </span>
          </button>
        </div>


        {/* Detalles técnicos */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">
            Detalles técnicos{' '}
            <span className="text-xs text-neutral-600">(opcional)</span>
          </label>

          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) =>
                  setSpecs((prev) =>
                    prev.map((s, idx) =>
                      idx === i ? { ...s, label: e.target.value } : s,
                    ),
                  )
                }
                placeholder="Cantidad de puertas"
                className="w-1/2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-500"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) =>
                  setSpecs((prev) =>
                    prev.map((s, idx) =>
                      idx === i ? { ...s, value: e.target.value } : s,
                    ),
                  )
                }
                placeholder="4"
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-500"
              />
              <button
                type="button"
                onClick={() =>
                  setSpecs((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="shrink-0 rounded-lg border border-neutral-800 px-3 text-sm text-neutral-500 hover:border-red-800 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setSpecs((prev) => [...prev, { label: '', value: '' }])}
            className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
          >
            + Agregar fila
          </button>
        </div>


          {/* Promoción */}
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">⭐ Destacado</p>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                featured ? 'bg-yellow-500' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                  featured ? 'translate-x-7 bg-black' : 'translate-x-1 bg-neutral-400'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-1 border-t border-neutral-800 pt-3">
            <label className="text-sm text-neutral-400">Descuento</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as typeof discountType)}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-neutral-500"
            >
              <option value="">Sin descuento</option>
              <option value="PERCENTAGE">Porcentaje (%)</option>
              <option value="FIXED">Monto fijo ($)</option>
              <option value="TWO_FOR_ONE">2x1</option>
            </select>

            {(discountType === 'PERCENTAGE' || discountType === 'FIXED') && (
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                min={0}
                step={0.01}
                  onWheel={(e) => e.currentTarget.blur()}
                placeholder={discountType === 'PERCENTAGE' ? 'Ej: 20' : 'Ej: 5000'}
                className="mt-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-500"
              />
            )}
          </div>
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