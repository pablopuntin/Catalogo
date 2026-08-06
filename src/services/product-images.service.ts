import { api } from './api';

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export const productImagesService = {
  upload: async (
    productId: string,
    file: File,
    isPrimary: boolean,
    token: string,
  ): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', String(isPrimary));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/images`,
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
      throw new Error(data.message ?? 'Error al subir la imagen.');
    }

    return data;
  },

  remove: async (
    productId: string,
    imageId: string,
    token: string,
  ): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/images/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error al eliminar la imagen.');
    }
  },
};
