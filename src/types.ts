export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  inStock: boolean;
  code?: string;
  description?: string;
  specs?: {
    label: string;
    value: string;
  }[];
}

export type Screen = 'home' | 'catalog' | 'details' | 'orders' | 'profile' | 'video';
