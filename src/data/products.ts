import { Product } from "@/types/products";

export const products: Product []  = [
  {
  id: "1",
  slug: "zapatilla-running-pro",
  name: "Zapatilla Running Pro",
  description:
    "Zapatilla liviana ideal para entrenamiento y uso diario.",
  category: "Calzado",
  featured: true,
  price: 89999,
  image: "https://picsum.photos/400/400?1",
},
  {
    id: "2",
    slug: "remera-deportiva",
    name: "Remera Deportiva",
     description:
    "Remera ideal para entrenamiento y uso diario.",
    category: "Remeras",
  featured: true,
    price: 25999,
    image: "https://picsum.photos/400/400?2",
  },
  {
    id: "3",
    slug: "mochila-urbana",
    name: "Mochila Urbana",
    description:
    "Mochila reforzada ideal para entrenamiento y uso diario.",
    category: "Mochilas",
  featured: true,
    price: 45999,
    image: "https://picsum.photos/400/400?3",
  },
  {
    id: "4",
    slug: "botella-termica",
    name: "Botella Térmica",
    description:
    "Botella termica, mantiene la temperatura por 4 hs, facil de llevar.",
    category: "Accesorios",
  featured: true,
    price: 15999,
    image: "https://picsum.photos/400/400?4",
  },
];