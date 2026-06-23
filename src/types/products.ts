export interface Product {
  id: string;
  slug: string;

  name: string;

  description: string;

  price: number;

  image: string;

  categoryId: string;

  featured: boolean;

  offer: boolean;
}