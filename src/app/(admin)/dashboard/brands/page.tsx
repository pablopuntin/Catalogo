'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/features/authentication/auth.store';
import { brandsService, Brand } from '@/services/brands.service';

export default function BrandsPage() {
  const token = useAuthStore((s) => s.accessToken)!;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetBrandId = useRef<string | null>(null);

  async function load() {
    if (!token) return;
    try {
      const data = await brandsService.findAllAdmin(token);
      setBrands(data);
    } catch {
      setError('No se pudieron cargar las marcas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function pickFile(brandId: string) {
    targetBrandId.current = brandId;
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const brandId = targetBrandId.current;
    e.target.value = '';

    if (!file || !brandId) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('El logo no puede superar los 5MB.');
      return;
    }

    setError('');
    setUploadingId(brandId);

    try {
      const updated = await brandsService.uploadLogo(brandId, file, token);
      setBrands((prev) =>
        prev.map((b) => (b.id === brandId ? { ...b, logoUrl: updated.logoUrl } : b)),
      );
    } catch {
      setError('Error al subir el logo.');
    } finally {
      setUploadingId(null);
    }
  }

  async function handleRemoveLogo(brandId: string) {
    setError('');
    setUploadingId(brandId);
    try {
      await brandsService.removeLogo(brandId, token);
      setBrands((prev) =>
        prev.map((b) => (b.id === brandId ? { ...b, logoUrl: null } : b)),
      );
    } catch {
      setError('Error al quitar el logo.');
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-bold text-white sm:text-2xl">Marcas</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Subí el logo de cada marca. Si no tiene, se muestra el nombre.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {loading ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          Cargando marcas...
        </p>
      ) : brands.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          Todavía no hay marcas. Se crean al cargar productos.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-800 sm:h-20 sm:w-20">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-neutral-600">Sin logo</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {brand.name}
                </p>
                {!brand.active && (
                  <span className="text-xs text-neutral-500">Inactiva</span>
                )}

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={uploadingId === brand.id}
                    onClick={() => pickFile(brand.id)}
                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white disabled:opacity-50"
                  >
                    {uploadingId === brand.id
                      ? 'Subiendo...'
                      : brand.logoUrl
                        ? '🔄 Cambiar'
                        : '📷 Subir logo'}
                  </button>

                  {brand.logoUrl && (
                    <button
                      type="button"
                      disabled={uploadingId === brand.id}
                      onClick={() => handleRemoveLogo(brand.id)}
                      className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-800 disabled:opacity-50"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}