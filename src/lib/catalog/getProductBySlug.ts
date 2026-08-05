import { catalogService } from '@/services/catalog.service';

export async function getProductBySlug(slug: string) {
  return catalogService.getProductBySlug(slug);
}