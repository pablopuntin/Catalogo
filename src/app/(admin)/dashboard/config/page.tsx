'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/authentication/auth.store';
import {
  businessConfigService,
  BusinessConfig,
} from '@/services/business-config.service';
import { ApiException } from '@/services/api';

export default function ConfigPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken)!;

  // Campos
  const [businessName, setBusinessName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [currency, setCurrency] = useState('ARS');

  // Estado
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!token) return;
    businessConfigService.get(token)
      .then((config) => {
        setBusinessName(config.businessName ?? '');
        setLegalName(config.legalName ?? '');
        setBusinessDescription(config.businessDescription ?? '');
        setBusinessHours(config.businessHours ?? '');
        setWhatsapp(config.whatsapp ?? '');
        setPhone(config.phone ?? '');
        setEmail(config.email ?? '');
        setInstagram(config.instagram ?? '');
        setFacebook(config.facebook ?? '');
        setTiktok(config.tiktok ?? '');
        setWebsite(config.website ?? '');
        setAddress(config.address ?? '');
        setCity(config.city ?? '');
        setProvince(config.province ?? '');
        setCountry(config.country ?? '');
        setLogoUrl(config.logoUrl ?? '');
        setHeroImageUrl(config.heroImageUrl ?? '');
        setCurrency(config.currency ?? 'ARS');
      })
      .catch(() => setIsNew(true))
      .finally(() => setLoadingData(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!businessName.trim()) {
      setError('El nombre del negocio es obligatorio.');
      return;
    }

    if (!whatsapp.trim()) {
      setError('El WhatsApp es obligatorio.');
      return;
    }

    const hasSocial = instagram || facebook || tiktok || website;
    if (!hasSocial) {
      setError('Completá al menos una red social o sitio web.');
      return;
    }

    setLoading(true);

    const data = {
      businessName: businessName.trim(),
      legalName: legalName.trim() || undefined,
      businessDescription: businessDescription.trim() || undefined,
      businessHours: businessHours.trim() || undefined,
      whatsapp: whatsapp.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      instagram: instagram.trim() || undefined,
      facebook: facebook.trim() || undefined,
      tiktok: tiktok.trim() || undefined,
      website: website.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      province: province.trim() || undefined,
      country: country.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      heroImageUrl: heroImageUrl.trim() || undefined,
      currency,
    };

    try {
      if (isNew) {
        await businessConfigService.create(data, token);
        setIsNew(false);
      } else {
        await businessConfigService.update(data, token);
      }
      setSuccess('Datos guardados correctamente.');
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al guardar los datos.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-neutral-400 text-sm">Cargando...</p>
      </div>
    );
  }

  const inputClass = "rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 text-sm outline-none focus:border-neutral-500 w-full";
  const labelClass = "text-sm text-neutral-400 mb-1";
  const sectionClass = "flex flex-col gap-4";
  const sectionTitleClass = "text-sm font-semibold text-neutral-300 border-b border-neutral-800 pb-2";

  return (
    <div className="max-w-lg mx-auto pb-16">
      <h1 className="text-xl font-bold mb-6">Datos del Negocio</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* Información del negocio */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>Información del negocio</p>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Nombre comercial <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ej: Deportes Max"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Razón social</label>
            <input
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Ej: Deportes Max S.R.L."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Descripción</label>
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Contá brevemente de qué se trata tu negocio..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Horario de atención
              <span className="text-neutral-600 text-xs ml-2">(recomendado)</span>
            </label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              placeholder="Ej: Lunes a Viernes de 09:00 a 18:00"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Moneda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
            >
              <option value="ARS">ARS — Peso argentino</option>
              <option value="USD">USD — Dólar estadounidense</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
        </div>

        {/* Contacto */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>Contacto</p>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej: 5493857408499"
              className={inputClass}
            />
            <p className="text-xs text-neutral-600 mt-1">
              Incluí el código de país sin el +. Ej: 549 para Argentina.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 3857408499"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: contacto@negocio.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Redes sociales */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>
            Redes sociales
            <span className="text-neutral-600 text-xs ml-2 font-normal">
              (al menos una recomendada)
            </span>
          </p>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/tunegocio"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Facebook</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/tunegocio"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>TikTok</label>
            <input
              type="url"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="https://tiktok.com/@tunegocio"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Sitio web</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://tunegocio.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>
            Ubicación
            <span className="text-neutral-600 text-xs ml-2 font-normal">
              (recomendado si tenés local físico)
            </span>
          </p>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Av. Belgrano 123"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Ciudad</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: Buenos Aires"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Provincia</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Ej: Buenos Aires"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>País</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ej: Argentina"
              className={inputClass}
            />
          </div>
        </div>

        {/* Apariencia */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>
            Apariencia
            <span className="text-neutral-600 text-xs ml-2 font-normal">
              (recomendado completar al menos uno)
            </span>
          </p>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Imagen principal (hero)</label>
            <input
              type="url"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Error y éxito */}
        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-400 text-center">{success}</p>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-black py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar datos'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-lg border border-neutral-700 py-3 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}