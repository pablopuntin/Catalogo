'use client';

import { useState } from 'react';
import { BusinessConfig } from '@/services/business-config.service';

type FooterProps = {
  config: BusinessConfig | null;
};

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function IconWeb() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function Footer({ config }: FooterProps) {
  const [showCreator, setShowCreator] = useState(false);

  if (!config) return null;

  const hasSocial = config.instagram || config.facebook || config.tiktok || config.website;
  const hasLocation = config.address || config.city || config.province;
  const hasContact = config.phone || config.email || config.whatsapp;

  return (
    <footer className="mt-8 border-t border-neutral-800 bg-black px-4 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">

        {/* Nombre y horario */}
          <div className="text-center">
          <p className="text-lg font-bold text-white leading-tight">
            {config.businessName}
          </p>
          {config.businessHours && (
            <p className="mt-1 text-xs text-neutral-400">
              🕐 {config.businessHours}
            </p>
          )}
        </div>

        {/* Contacto + Ubicación + Redes — fila en desktop, apilado en mobile */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">

          {/* Contacto + Ubicación + Redes — fila que envuelve */}
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">

          {/* Contacto — pills al ancho del texto */}
          {hasContact && (
            <div className="flex flex-wrap gap-2 shrink-0">
              {config.whatsapp && (
                <a
                  href={'https://wa.me/' + config.whatsapp.replace(/\D/g, '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1.5 text-xs text-green-400 hover:border-green-600 transition-colors"
                >
                  💬 WhatsApp
                </a>
              )}
              {config.email && (
                <a
                  href={'mailto:' + config.email}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 transition-colors"
                >
                  ✉️ Email
                </a>
              )}
              {config.phone && (
                <a
                  href={'tel:' + config.phone.replace(/\s/g, '')}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 transition-colors"
                >
                  📞 {config.phone}
                </a>
              )}
            </div>
          )}

          {/* Ubicación — se estira y ocupa el espacio libre */}
          {hasLocation && (
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-sm text-neutral-300">
                📍{' '}
                {[config.address, config.city, config.province]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <a
                href={
                  'https://maps.google.com/?q=' +
                  encodeURIComponent(
                    [config.address, config.city, config.province, config.country]
                      .filter(Boolean)
                      .join(', '),
                  )
                }
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5 text-xs text-neutral-500 hover:text-white transition-colors"
              >
                Ver en Google Maps →
              </a>
            </div>
          )}

          {/* Redes — solo íconos SVG */}
          {hasSocial && (
            <div className="flex flex-wrap gap-2 shrink-0">
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center rounded-full border border-neutral-700 p-2 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                >
                  <IconInstagram />
                </a>
              )}
              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center rounded-full border border-neutral-700 p-2 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                >
                  <IconFacebook />
                </a>
              )}
              {config.tiktok && (
                <a
                  href={config.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex items-center justify-center rounded-full border border-neutral-700 p-2 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                >
                  <IconTiktok />
                </a>
              )}
              {config.website && (
                <a
                  href={config.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sitio web"
                  className="flex items-center justify-center rounded-full border border-neutral-700 p-2 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                >
                  <IconWeb />
                </a>
              )}
            </div>
          )}

        </div>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} • {config.businessName}
          </p>

          <button
            onClick={() => setShowCreator(true)}
            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Creado por Pablo Puntin
          </button>
        </div>

        {/* Modal Creado por */}
        {showCreator && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
              <p className="font-semibold text-white mb-1">Pablo Puntin</p>
              <p className="text-xs text-neutral-400 mb-4">Desarrollo de software</p>

              <div className="flex flex-col gap-2">
                <a
                  href="mailto:pablopuntin@gmail.com"
                  className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-3 text-sm text-neutral-300 hover:border-neutral-500 transition-colors"
                >
                  ✉️ pablopuntin@gmail.com
                </a>
                <a
                  href="https://wa.me/549TUNUMERO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-3 text-sm text-green-400 hover:border-green-600 transition-colors"
                >
                  💬 WhatsApp
                </a>
              </div>
          
              <button
                onClick={() => setShowCreator(false)}
                className="mt-4 w-full rounded-lg border border-neutral-700 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

      </div>
      
    </footer>
    );
}
