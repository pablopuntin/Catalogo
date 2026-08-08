export type CatalogImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogBrand = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogPromotion = {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'TWO_FOR_ONE' | 'FIXED' | 'FEATURED';
  discountValue: string | null;
};

// export type CatalogProduct = {
//   id: string;
//   name: string;
//   slug: string;
//   description: string | null;
//   sku: string;
//   price: string;
//   active: boolean;
//   brand: CatalogBrand;
//   categories: {
//     categoryId: string;
//     category: CatalogCategory;
//   }[];
//   images: CatalogImage[];
// };

//ref
export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  price: string;
  finalPrice: string | null;    // ← nuevo
  promotion: CatalogPromotion | null;  // ← nuevo
  featured: boolean;            // ← nuevo (destacado)
  active: boolean;
  brand: CatalogBrand;
  categories: {
    categoryId: string;
    category: CatalogCategory;
  }[];
  images: CatalogImage[];
};