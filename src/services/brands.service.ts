// import { api } from './api';

// export type Brand = {
//   id: string;
//   name: string;
//   slug: string;
//   description: string | null;
//   active: boolean;
// };

// export const brandsService = {
//   findAll: (token: string) =>
//     api.get<Brand[]>('/brands', token),
// };

//ref
import { api } from './api';

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  active: boolean;
};

export const brandsService = {
  findAll: (token: string) =>
    api.get<Brand[]>('/brands', token),

  findAllAdmin: (token: string) =>
    api.get<Brand[]>('/brands/admin', token),

  uploadLogo: async (
    brandId: string,
    file: File,
    token: string,
  ): Promise<Brand> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/brands/${brandId}/logo`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? 'Error al subir el logo.');
    }

    return data;
  },

  removeLogo: async (brandId: string, token: string): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/brands/${brandId}/logo`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error al quitar el logo.');
    }
  },
};