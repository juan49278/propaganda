
export type UnitType = 'unidad' | 'kg' | 'g' | 'litro' | 'pack';
export type PromotionType = 'dia' | 'semana' | 'general';

export interface Store {
  id: string;
  name: string;
  address: string;
  logoColor: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: UnitType;
  imageUrl?: string;
  category: string;
  isPromotion: boolean;
  promotionType?: PromotionType;
  slogan?: string;
  primaryColor?: string; // Hex code for the ad theme
}

export interface AppState {
  stores: Store[];
  products: Product[];
  currentStoreId?: string;
  currentProductIds?: string[]; // Support for multiple products in a slider
  displayDuration?: number; // In seconds
  view: 'dashboard' | 'display' | 'management';
}
