'use client';

import { useEffect, useState } from 'react';
import { CatalogProduct } from '@/types/catalog';
import { quotesService } from '@/services/quotes.service';

export type CartItem = {
  product: CatalogProduct;
  quantity: number;
};

const STORAGE_KEY = 'cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar el carrito guardado al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  // Guardar cada vez que cambia (después de la carga inicial)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, loaded]);

  function add(product: CatalogProduct) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity < 5 ? i.quantity + 1 : 5 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function remove(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function clear() {
    setCart([]);
  }

  async function confirm(phone: string) {
    const message =
      cart.length === 0
        ? 'Hola, quisiera realizar una consulta.'
        : `Hola, quisiera consultar por los siguientes productos:\n\n${cart
            .map(
              (item) =>
                `🛍️ ${item.product.name} x${item.quantity} - $${Number(item.product.price).toLocaleString('es-AR')}`,
            )
            .join('\n')}\n\n¿Tenés disponibilidad?`;

    if (cart.length > 0) {
      quotesService
        .create({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          notes: 'Consulta desde el catálogo',
        })
        .catch(() => {});
    }

    clear();

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank',
    );
  }

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return { cart, add, remove, clear, confirm, totalItems };
}