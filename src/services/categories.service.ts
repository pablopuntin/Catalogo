import { api } from './api';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
};

export const categoriesService = {
  findAll: (token: string) =>
    api.get<Category[]>('/categories/admin', token),

  findAllPublic: () =>
    api.get<Category[]>('/categories'),
};

// export const categoriesService = {
//   findAll: (token: string) =>
//     api.get<Category[]>('/categories', token),
// };