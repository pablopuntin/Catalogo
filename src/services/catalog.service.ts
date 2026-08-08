// import { api } from './api';
// import { CatalogProduct, CatalogCategory } from '@/types/catalog';

// export const catalogService = {
//   getProducts: () =>
//     api.get<CatalogProduct[]>('/products'),

//   getProductBySlug: (slug: string) =>
//     api.get<CatalogProduct>(`/products/slug/${slug}`),

//   getCategories: () =>
//     api.get<CatalogCategory[]>('/categories'),
// };

//ref
import { api } from './api';
import { CatalogProduct, CatalogCategory, CatalogBrand } from '@/types/catalog';

export const catalogService = {
  getProducts: () =>
    api.get<CatalogProduct[]>('/products'),

  getProductBySlug: (slug: string) =>
    api.get<CatalogProduct>(`/products/slug/${slug}`),

  getCategories: () =>
    api.get<CatalogCategory[]>('/categories'),

  getBrands: () =>
    api.get<CatalogBrand[]>('/brands'),
};