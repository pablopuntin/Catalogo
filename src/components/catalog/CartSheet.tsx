'use client';

import { CatalogProduct } from '@/types/catalog';

type CartItem = {
  product: CatalogProduct;
  quantity: number;
};

type CartSheetProps = {
  cart: CartItem[];
  onRemove: (productId: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export function CartSheet({
  cart,
  onRemove,
  onConfirm,
  onClose,
}: CartSheetProps) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <h2 className="font-semibold text-sm">
            Mi consulta ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="px-4 py-3 flex flex-col gap-3 max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-neutral-400 text-sm text-center py-6">
              No hay productos en tu consulta.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3"
              >
                {/* Imagen */}
                <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-600 text-xs">?</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    x{item.quantity} — ${Number(item.product.price).toLocaleString('es-AR')}
                  </p>
                </div>

                {/* Quitar */}
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-neutral-500 hover:text-red-400 transition-colors shrink-0 px-2"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Acciones */}
        <div className="px-4 py-4 border-t border-neutral-800">
          {cart.length > 0 ? (
            <button
              onClick={onConfirm}
              className="w-full bg-green-600 text-white py-3 rounded-full text-sm font-semibold"
            >
              Enviar consulta por WhatsApp
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full border border-neutral-700 text-neutral-400 py-3 rounded-full text-sm"
            >
              Cerrar
            </button>
          )}
        </div>

      </div>
    </>
  );
}