
export type UnitType = 'unidad' | 'kg' | 'g' | 'litro' | 'pack';
export type PromotionType = 'dia' | 'semana' | 'general';
export type FontType = 'font-bebas' | 'font-sans' | 'font-serif' | 'font-mono';

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

export interface Announcement {
  id: string;
  title: string;
  message: string;
  fontSize: number; // in pixels
  fontFamily: FontType;
  backgroundColor: string;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  hasAnimation: boolean;
}

export interface DisplayItem {
  type: 'product' | 'announcement';
  id: string;
}

export interface AppState {
  stores: Store[];
  products: Product[];
  announcements: Announcement[];
  currentStoreId?: string;
  currentItems?: DisplayItem[];
  displayDuration?: number; 
  view: 'dashboard' | 'display' | 'management';
}
