// Angular Models — mirroring the .NET Models exactly

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number | null;
  category: string;
  description: string;
  image: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CartItemRequest {
  productId: string;
  productName: string;
  price: number | null;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  coordinates?: Coordinates;
  notes?: string;
}

export type OrderStatus = 'Pending' | 'Sent' | 'Failed';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items?: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
  emailLog?: string;
}

export interface OrderRequest {
  customer: CustomerInfo;
  items: CartItemRequest[];
  totalPrice: number;
}

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  message: string;
  type: ToastType;
}
