'use client';

import { AdminGuard } from './AdminGuard';
import { AdminSidebar } from './AdminSidebar';
import { useState } from 'react';

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-950 text-white">

        {/* Header mobile */}
        <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-4 lg:hidden">
          <span className="font-bold text-sm">Panel Admin</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-neutral-400 hover:text-white"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </header>

        <div className="flex">

          {/* Sidebar desktop */}
          <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:min-h-screen border-r border-neutral-800">
            <AdminSidebar />
          </aside>

          {/* Sidebar mobile — overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setSidebarOpen(false)}
              />
              <aside className="absolute left-0 top-0 bottom-0 w-64 bg-neutral-950 border-r border-neutral-800 z-10">
                <AdminSidebar />
              </aside>
            </div>
          )}

          {/* Contenido */}
          {/* <main className="flex-1 p-4 lg:p-6"> */}
          <main className="flex-1 min-w-0 p-4 lg:p-6">
            {children}
          </main>

        </div>
      </div>
    </AdminGuard>
  );
}