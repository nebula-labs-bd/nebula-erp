export type ProductType =
  | "single"
  | "variable"
  | "service"
  | "combo";


export type SyncStatus =
  | "not-synced"
  | "synced"
  | "failed"
  | "pending";


export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}


export interface ProductAttribute {
  name: string;
  values: string[];
}


export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  stock: number;
}


export interface ProductIntegration {
  wooCommerceId?: string;
  shopifyId?: string;

  syncStatus: SyncStatus;

  lastSyncAt?: string;

  syncError?: string;
}


export interface ProductWarranty {
  enabled: boolean;

  duration?: number;

  unit?: 
    | "days"
    | "months"
    | "years";
}


export interface ProductMaster {

  id: string;


  // Basic Information

  name: string;

  sku: string;

  barcode?: string;

  type: ProductType;


  categoryId?: string;

  brandId?: string;

  unitId?: string;



  // Commerce Information

  shortDescription?: string;

  longDescription?: string;

  tags: string[];

  images: ProductImage[];

  attributes: ProductAttribute[];

  variants: ProductVariant[];



  // Pricing

  costPrice: number;

  sellingPrice: number;

  wholesalePrice?: number;


  taxRate?: number;



  // Inventory

  openingStock: number;

  currentStock: number;

  reorderLevel?: number;


  warehouseIds: string[];


  batchTracking: boolean;

  serialTracking: boolean;



  // Warranty

  warranty?: ProductWarranty;



  // Integration

  integration?: ProductIntegration;



  createdAt: string;

  updatedAt: string;
}


export interface CreateProductMasterInput {

  name: string;

  sku: string;

  type: ProductType;


  categoryId?: string;

  brandId?: string;

  unitId?: string;


  shortDescription?: string;

  longDescription?: string;


  costPrice: number;

  sellingPrice: number;


  openingStock: number;
}