// import { api } from './api';
// import { CatalogProduct, CatalogCategory, CatalogBrand } from '@/types/catalog';

// export const catalogService = {
//   getProducts: () =>
//     api.get<CatalogProduct[]>('/products'),

//   getProductBySlug: (slug: string) =>
//     api.get<CatalogProduct>(`/products/slug/${slug}`),

//   getCategories: () =>
//     api.get<CatalogCategory[]>('/categories'),

//   getBrands: () =>
//     api.get<CatalogBrand[]>('/brands'),
// };

//ref
import { api } from './api';
import { CatalogProduct, CatalogCategory, CatalogBrand } from '@/types/catalog';

export type ProductQuery = {
  page?: number;
  limit?: number;
  categoria?: string;
  marca?: string;
  oferta?: string;
  destacado?: string;
  q?: string;
};

export type PaginatedProducts = {
  items: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

function toQueryString(query: ProductQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const catalogService = {
  getProducts: (query: ProductQuery = {}) =>
    api.get<PaginatedProducts>(`/products${toQueryString(query)}`),

  getProductBySlug: (slug: string) =>
    api.get<CatalogProduct>(`/products/slug/${slug}`),

  getCategories: () =>
    api.get<CatalogCategory[]>('/categories'),

  getBrands: () =>
    api.get<CatalogBrand[]>('/brands'),
};