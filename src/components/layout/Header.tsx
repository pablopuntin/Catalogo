//ref con el modal del carrito
import Link from 'next/link';
import { BusinessConfig } from '@/services/business-config.service';

type HeaderProps = {
  count: number;
  config: BusinessConfig | null;
  onCartOpen: () => void;
};

export function Header({ count, config, onCartOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-black border-b">
      <div className="flex items-center justify-between p-4">
        <Link
          href="/login"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Acceder
        </Link>

      
        <h1 className="font-bold">
  {config?.logoUrl ? (
    <img
      src={config.logoUrl}
      alt={config.businessName}
      className="h-8 w-auto object-contain"
    />
  ) : (
    config?.businessName ?? 'Catálogo'
  )}
</h1>


        <h1 className="font-bold">
          {config?.businessName ?? 'Catálogo'}
        </h1>

        <button
          onClick={onCartOpen}
          className="text-sm font-medium"
        >
          🛒 {count}
        </button>
      </div>
    </header>
  );
}