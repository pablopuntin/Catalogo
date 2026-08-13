import { api } from './api';

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductCategory = {
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  price: string;
  active: boolean;
  featured?: boolean;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'TWO_FOR_ONE' | null;
 discountValue?: string | number | null;
  specs?: { id: string; label: string; value: string }[];
  brandId: string;
  deletedAt: string | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  categories: ProductCategory[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type CreateCatalogProductPayload = {
  categories: { id?: string; name?: string }[];
  brand: { id?: string; name?: string };
  product: {
    name: string;
    description?: string;
    price: number;
    active?: boolean;
     imageUrl?: string;
    featured?: boolean;
    discountType?: 'PERCENTAGE' | 'FIXED' | 'TWO_FOR_ONE' | null;
    discountValue?: number | null;
    specs?: { label: string; value: string }[];
  };
};

export type UpdateCatalogProductPayload = {
  categories?: { id?: string; name?: string }[];
  brand?: { id?: string; name?: string };
  product?: {
    name?: string;
    description?: string;
    price?: number;
   active?: boolean;
    imageUrl?: string;
    featured?: boolean;
    discountType?: 'PERCENTAGE' | 'FIXED' | 'TWO_FOR_ONE' | null;
    discountValue?: number | null;
    specs?: { label: string; value: string }[];
  };
};

export const productsService = {
  findAll: (token: string) =>
    api.get<Product[]>('/products/admin', token),

  // el resto igual



// export const productsService = {
//   findAll: (token: string) =>
//     api.get<Product[]>('/products', token),

  findOne: (id: string, token: string) =>
    api.get<Product>(`/products/admin/${id}`, token),

  findAllActive: (token: string) =>
  api.get<Product[]>('/products/admin/active', token),

findAllInactiveAndDeleted: (token: string) =>
  api.get<Product[]>('/products/admin/inactive', token),

  create: (payload: CreateCatalogProductPayload, token: string) =>
    api.post<Product>('/catalog/product', payload, token),

  update: (id: string, payload: Partial<CreateCatalogProductPayload>, token: string) =>
    api.patch<Product>(`/products/${id}`, payload, token),

  remove: (id: string, token: string) =>
    api.delete<void>(`/products/${id}`, token),

  restore: (id: string, token: string) =>
  api.patch<Product>(`/products/${id}/restore`, {}, token),

  updateCatalog: (id: string, payload: UpdateCatalogProductPayload, token: string) =>
  api.patch<Product>(`/catalog/product/${id}`, payload, token),

};