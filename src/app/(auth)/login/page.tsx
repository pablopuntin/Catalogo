'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ApiException } from '@/services/api';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">

    
<div className="mb-8">
  <Link
    href="/"
    className="text-xs text-neutral-500 hover:text-white transition-colors"
  >
    ← Volver al catálogo
  </Link>
</div>

        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Panel de administración
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white text-sm outline-none focus:border-neutral-500"
              placeholder="admin@mail.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white text-sm outline-none focus:border-neutral-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-white text-black py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

      </div>
    </div>
  );
}