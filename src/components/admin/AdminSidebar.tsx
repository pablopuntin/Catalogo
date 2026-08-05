//ref
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard',         href: '/dashboard' },
  { label: 'Consultas',         href: '/dashboard/quotes' },
  { label: 'Datos del Negocio', href: '/dashboard/config' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col h-screen p-4">

      <div className="flex-1 overflow-y-auto">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-6">
          Panel Admin
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  rounded-lg px-4 py-3 text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-neutral-800 pt-4 shrink-0">
        <p className="text-sm text-white font-medium">
          {user?.name} {user?.lastName}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {user?.roles.join(', ')}
        </p>
        <button
          onClick={logout}
          className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

    </aside>
  );
}