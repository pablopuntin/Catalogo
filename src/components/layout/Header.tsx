// // import Link from 'next/link';

// // type HeaderProps = {
// //   count: number;
// //   message: string;
// // };

// // export function Header({ count, message }: HeaderProps) {
// //   function handleWhatsApp() {
// //     const phone = '5493857408499';
// //     const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
// //     window.open(url, '_blank');
// //   }

// //   return (
// //     <header className="sticky top-0 bg-black border-b">
// //       <div className="flex items-center justify-between p-4">
// //         <Link
// //           href="/login"
// //           className="text-xs text-neutral-400 hover:text-white transition-colors"
// //         >
// //           Acceder
// //         </Link>

// //         <h1 className="font-bold">Deportes Max</h1>

// //         <button onClick={handleWhatsApp} className="text-sm font-medium">
// //           🛒 {count}
// //         </button>
// //       </div>
// //     </header>
// //   );
// // }


// //ref
// import Link from 'next/link';
// import { BusinessConfig } from '@/services/business-config.service';

// type HeaderProps = {
//   count: number;
//   message: string;
//   config: BusinessConfig | null;
//   onWhatsApp: () => void;
// };

// export function Header({ count, config, onWhatsApp }: HeaderProps) {
//   return (
//     <header className="sticky top-0 bg-black border-b">
//       <div className="flex items-center justify-between p-4">
//         <Link
//           href="/login"
//           className="text-xs text-neutral-400 hover:text-white transition-colors"
//         >
//           Acceder
//         </Link>

//         <h1 className="font-bold">
//           {config?.businessName ?? 'Catálogo'}
//         </h1>

//         <button onClick={onWhatsApp} className="text-sm font-medium">
//           🛒 {count}
//         </button>
//       </div>
//     </header>
//   );
// }

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