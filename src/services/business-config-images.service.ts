export const businessConfigImagesService = {
  uploadLogo: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/business-config/logo`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? 'Error al subir el logo.');
    return data;
  },

  uploadHero: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/business-config/hero`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? 'Error al subir la imagen.');
    return data;
  },
};