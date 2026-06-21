export interface MenuItem {
  id: string;
  name: string;
  price: number | null;
  category: string;
  description: string;
  image: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  coordinates: Coordinates;
  notes?: string;
}

export type OrderStatus = 'pending' | 'sent' | 'failed';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
  emailLog?: string;
}
