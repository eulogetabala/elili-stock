import { Asset, FindAssetsParams, PaginatedResponse, LicenseType, Order, OrderStatus, DownloadResponse, CreateOrderDto } from "@/types/asset";
import { apiClient } from "./api-client";

/**
 * Recherche et filtre les assets
 * GET /assets?search=...&type=...&category=...
 */
export async function searchAssets(params: FindAssetsParams): Promise<PaginatedResponse<Asset>> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.type) queryParams.set('type', params.type);
  if (params.category) queryParams.set('category', params.category);
  if (params.tags && params.tags.length > 0) queryParams.set('tags', params.tags.join(','));
  if (params.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
  if (params.isFree !== undefined) queryParams.set('isFree', params.isFree.toString());
  if (params.photographerId) queryParams.set('photographerId', params.photographerId);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

  return apiClient.get<PaginatedResponse<Asset>>(`/assets?${queryParams.toString()}`);
}

/**
 * Récupère un asset par ID
 * GET /assets/:id
 */
export async function getAssetById(id: string): Promise<Asset | null> {
  try {
    return await apiClient.get<Asset>(`/assets/${id}`);
  } catch (error: any) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

/**
 * Récupère les assets similaires
 */
export async function getSimilarAssets(asset: Asset, limit: number = 6): Promise<Asset[]> {
  const params: FindAssetsParams = {
    page: 1,
    limit,
    category: asset.category,
    sortBy: 'views',
    sortOrder: 'desc',
  };
  
  const result = await searchAssets(params);
  return result.data.filter((a) => a._id !== asset._id).slice(0, limit);
}

/**
 * Récupère les assets du même photographe
 */
export async function getPhotographerAssets(photographerId: string, excludeId?: string, limit: number = 4): Promise<Asset[]> {
  const params: FindAssetsParams = {
    page: 1,
    limit,
    photographerId,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };
  
  const result = await searchAssets(params);
  return result.data.filter((a) => a._id !== excludeId).slice(0, limit);
}

/**
 * Suggestions de recherche
 */
export async function getSearchSuggestions(query: string): Promise<{ assets: Asset[]; tags: string[] }> {
  if (!query || query.length < 2) return { assets: [], tags: [] };

  const params: FindAssetsParams = {
    page: 1,
    limit: 5,
    search: query,
  };

  const result = await searchAssets(params);
  
  // Extraire les tags uniques
  const allTags = result.data.flatMap((a) => a.tags);
  const uniqueTags = [...new Set(allTags)];
  const matchingTags = uniqueTags
    .filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  return { assets: result.data, tags: matchingTags };
}

/**
 * Télécharge un asset gratuit
 * GET /assets/:id/download
 */
export async function downloadAsset(assetId: string): Promise<DownloadResponse> {
  return apiClient.get<DownloadResponse>(`/assets/${assetId}/download`);
}

/**
 * Crée une commande
 * POST /orders
 */
export async function createOrder(dto: CreateOrderDto): Promise<{ order: Order; clientSecret?: string }> {
  return apiClient.post<{ order: Order; clientSecret?: string }>('/orders', dto);
}

/**
 * Récupère l'historique des commandes de l'utilisateur
 * GET /orders/my-orders
 */
export async function getMyOrders(): Promise<Order[]> {
  return apiClient.get<Order[]>('/orders/my-orders');
}

/**
 * Upload un nouvel asset
 * POST /assets/upload
 */
export async function uploadAsset(
  file: File,
  data: {
    title: string;
    description?: string;
    type: string;
    category: string;
    tags?: string[];
    priceStandard?: number;
    priceCommercial?: number;
    isFree?: boolean;
  }
): Promise<Asset> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  formData.append('type', data.type);
  formData.append('category', data.category);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.priceStandard !== undefined) formData.append('priceStandard', data.priceStandard.toString());
  if (data.priceCommercial !== undefined) formData.append('priceCommercial', data.priceCommercial.toString());
  if (data.isFree !== undefined) formData.append('isFree', data.isFree.toString());

  return apiClient.upload<Asset>('/assets/upload', formData);
}

/**
 * Formate la taille d'un fichier
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Formate un nombre avec séparateur de milliers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
