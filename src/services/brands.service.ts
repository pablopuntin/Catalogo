import { api } from './api';

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
};

export const brandsService = {
  findAll: (token: string) =>
    api.get<Brand[]>('/brands', token),
};