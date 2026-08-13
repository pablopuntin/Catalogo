import { api } from './api';

export type HeroImage = {
  id: string;
  url: string;
  sortOrder: number;
};


export type BusinessConfig = {
  id: string;
  businessName: string;
  legalName: string | null;
  logoUrl: string | null;
  heroImages: HeroImage[];
  businessDescription: string | null;
  whatsapp: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  currency: string;
  businessHours: string | null;
};

export const businessConfigService = {
  getPublic: () =>
    api.get<BusinessConfig>('/business-config/public'),

  get: (token: string) =>
    api.get<BusinessConfig>('/business-config', token),

  create: (data: Partial<BusinessConfig>, token: string) =>
    api.post<BusinessConfig>('/business-config', data, token),

  update: (data: Partial<BusinessConfig>, token: string) =>
    api.patch<BusinessConfig>('/business-config', data, token),
};