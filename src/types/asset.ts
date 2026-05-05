// Types miroir du backend NestJS

export enum AssetType {
  IMAGE = "image",
  VIDEO = "video",
  VECTOR = "vector",
  PSD = "psd",
  AI = "ai",
}

export enum AssetCategory {
  PEOPLE = "people",
  NATURE = "nature",
  ARCHITECTURE = "architecture",
  CULTURE = "culture",
  BUSINESS = "business",
  STREET = "street",
  OTHER = "other",
}

export enum AssetStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum LicenseType {
  FREE = "free",
  STANDARD = "standard",
  COMMERCIAL = "commercial",
}

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface TechnicalMetadata {
  fileSize?: number;
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
  aspectRatio?: string;
}

export interface Photographer {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Asset {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  watermarkedPreviewUrl?: string;
  photographer: Photographer;
  tags: string[];
  type: AssetType;
  category: AssetCategory;
  location?: string;
  status: AssetStatus;
  views: number;
  downloads: number;
  priceStandard: number;
  priceCommercial: number;
  isFree: boolean;
  technicalMetadata?: TechnicalMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface FindAssetsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  type?: AssetType;
  category?: AssetCategory;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
  photographerId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Order {
  _id: string;
  user: string;
  asset: Asset;
  licenseType: LicenseType;
  amount: number;
  currency: string;
  status: OrderStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface CreateOrderDto {
  assetId: string;
  licenseType: LicenseType;
}

export interface DownloadResponse {
  downloadUrl: string;
}
