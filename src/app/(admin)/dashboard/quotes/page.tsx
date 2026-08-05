'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/authentication/auth.store';
import { quotesService, QuoteMetrics, Quote } from '@/services/quotes.service';

export default function QuotesPage() {
  const token = useAuthStore((s) => s.accessToken)!;

  const [metrics, setMetrics] = useState<QuoteMetrics | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [limit, setLimit] = useState(5);

  async function loadMetrics() {
    if (!token) return;
    try {
      const data = await quotesService.getMetrics(token, {
        from: from || undefined,
        to: to || undefined,
        limit,
      });
      setMetrics(data);
    } catch {
      setMetrics(null);
    }
  }

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      loadMetrics(),
      quotesService.findAll(token).then(setQuotes).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [token]);

  function handleFilter() {
    setLimit(5);
    loadMetrics();
  }

  function handleClearFilter() {
    setFrom('');
    setTo('');
    setLimit(5);
    quotesService.getMetrics(token, { limit: 5 }).then(setMetrics).catch(() => {});
  }

  if (loading) {
    return (
      <p className="text-neutral-400 text-sm mt-6">Cargando consultas...</p>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6">Consultas</h1>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Hoy', value: metrics?.today ?? 0 },
          { label: 'Semana', value: metrics?.week ?? 0 },
          { label: 'Mes', value: metrics?.month ?? 0 },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-center"
          >
            <p className="text-2xl font-bold">{m.value}</p>
            <p className="text-xs text-neutral-400 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Filtro por fecha */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 mb-6">
        <p className="text-sm font-medium mb-3">
          Filtrar productos más consultados
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Desde</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Hasta</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white text-sm outline-none focus:border-neutral-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 rounded-lg bg-white text-black py-2 text-sm font-semibold"
            >
              Aplicar
            </button>
            {(from || to) && (
              <button
                onClick={handleClearFilter}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top productos */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-neutral-300 border-b border-neutral-800 pb-2 mb-3">
          Productos más consultados
        </p>

        {metrics?.topProducts.length === 0 ? (
          <p className="text-neutral-400 text-sm">
            Sin datos para el período seleccionado.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {metrics?.topProducts.map((p, i) => (
                <div
                  key={p.productId}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
                >
                  <span className="text-xs text-neutral-500 w-4">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm truncate">{p.name}</p>
                  <span className="text-sm font-bold">
                    {p.totalQuantity}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const newLimit = limit + 5;
                setLimit(newLimit);
                quotesService
                  .getMetrics(token, {
                    from: from || undefined,
                    to: to || undefined,
                    limit: newLimit,
                  })
                  .then(setMetrics)
                  .catch(() => {});
              }}
              className="mt-3 w-full rounded-lg border border-neutral-700 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Ver 5 más
            </button>
          </>
        )}
      </div>

      {/* Consultas recientes */}
      <div>
        <p className="text-sm font-semibold text-neutral-300 border-b border-neutral-800 pb-2 mb-3">
          Consultas recientes
        </p>

        {quotes.length === 0 ? (
          <p className="text-neutral-400 text-sm">No hay consultas todavía.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {quotes.slice(0, 20).map((quote) => (
              <div
                key={quote.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-neutral-400">
                    {new Date(quote.createdAt).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <span className="text-xs text-neutral-500">
                    {quote.items.length}{' '}
                    {quote.items.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {quote.items.map((item) => (
                    <p key={item.id} className="text-xs text-neutral-300">
                      {item.product.name} x{item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
