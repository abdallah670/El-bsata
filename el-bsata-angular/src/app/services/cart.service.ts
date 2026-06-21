import { Injectable, signal, computed } from '@angular/core';
import { CartItem, MenuItem } from '../models/models';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);
  isOpen = signal<boolean>(false);

  constructor(private toastService: ToastService) {}

  totalCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  totalPrice = computed(() => this.items().reduce((sum, item) => sum + ((item.item.price || 0) * item.quantity), 0));

  toggleCart(open?: boolean) {
    if (open !== undefined) {
      this.isOpen.set(open);
    } else {
      this.isOpen.update(val => !val);
    }
  }

  addToCart(item: MenuItem) {
    this.items.update(items => {
      const existing = items.find(i => i.item.id === item.id);
      if (existing) {
        return items.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...items, { item, quantity: 1 }];
      }
    });
    this.toastService.show(`تمت إضافة "${item.name}" إلى سلة طلبك!`, 'success');
  }

  updateQuantity(itemId: string, delta: number) {
    this.items.update(items => {
      return items.map(i => {
        if (i.item.id === itemId) {
          const nextQty = i.quantity + delta;
          return nextQty > 0 ? { ...i, quantity: nextQty } : null;
        }
        return i;
      }).filter((i): i is CartItem => i !== null);
    });
  }

  removeFromCart(itemId: string) {
    const itemToRemove = this.items().find(i => i.item.id === itemId);
    this.items.update(items => items.filter(i => i.item.id !== itemId));
    if (itemToRemove) {
      this.toastService.show(`تمت إزالة "${itemToRemove.item.name}" من طلبك`, 'info');
    }
  }

  clearCart() {
    this.items.set([]);
  }
}
