import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule, ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-angular';
import { CartService } from '../../services/cart.service';
import { CheckoutFormComponent } from '../checkout-form/checkout-form.component';
import { CustomerInfo } from '../../models/models';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CheckoutFormComponent],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <ng-container *ngIf="cartService.isOpen()">
      <div class="backdrop" [@fadeIn] (click)="cartService.toggleCart(false)"></div>

      <div class="cart-drawer" [@slideIn]>
        <div class="drawer-header">
          <div class="drawer-title">
            <lucide-icon [img]="ShoppingBag"></lucide-icon>
            <span>سلة طلباتك المستعجلة</span>
          </div>
          <button class="btn-icon" (click)="cartService.toggleCart(false)">
            <lucide-icon [img]="X" size="18"></lucide-icon>
          </button>
        </div>

        <div class="drawer-body">
          <div>
            <h4 class="section-label">عناصر السلة</h4>
            
            <div *ngIf="cartService.items().length === 0" class="cart-empty">
              <lucide-icon [img]="ShoppingBag" size="30" style="margin: 0 auto; display: block;"></lucide-icon>
              <p>السلة فارغة حالياً. انتقل للقائمة وأضف أطباقك المفضلة!</p>
            </div>

            <div *ngIf="cartService.items().length > 0" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div *ngFor="let item of cartService.items()" class="cart-item-row">
                <div class="cart-item-info">
                  <div class="cart-item-name">{{ item.item.name }}</div>
                  <div class="cart-item-price">{{ (item.item.price || 0) * item.quantity }} ج.م</div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div class="qty-control">
                    <button class="qty-btn" (click)="cartService.updateQuantity(item.item.id, -1)">
                      <lucide-icon [img]="Minus" size="12"></lucide-icon>
                    </button>
                    <span class="qty-count">{{ item.quantity }}</span>
                    <button class="qty-btn" (click)="cartService.updateQuantity(item.item.id, 1)">
                      <lucide-icon [img]="Plus" size="12"></lucide-icon>
                    </button>
                  </div>
                  <button class="remove-btn" (click)="cartService.removeFromCart(item.item.id)">
                    <lucide-icon [img]="Trash2" size="14"></lucide-icon>
                  </button>
                </div>
              </div>

              <div class="cart-total-row">
                <span>إجمالي القيمة:</span>
                <span class="cart-total-amount">{{ cartService.totalPrice() }} ج.م</span>
              </div>
            </div>
          </div>

          <app-checkout-form 
            *ngIf="cartService.items().length > 0" 
            (onSubmit)="submitOrder($event)"
            #checkoutForm>
          </app-checkout-form>
        </div>
      </div>
    </ng-container>
  `
})
export class CartDrawerComponent {
  @ViewChild('checkoutForm') checkoutForm!: CheckoutFormComponent;

  readonly ShoppingBag = ShoppingBag;
  readonly X = X;
  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly Trash2 = Trash2;

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  submitOrder(customer: CustomerInfo) {
    this.checkoutForm.isSubmitting = true;
    this.toastService.show('جاري إرسال وتأكيد الطلب عبر الخادم...', 'info');

    this.orderService.submitOrder({
      customer,
      items: this.cartService.items().map(i => ({
        productId: i.item.id,
        productName: i.item.name,
        price: i.item.price,
        quantity: i.quantity
      })),
      totalPrice: this.cartService.totalPrice()
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show(res.message, 'success');
          this.cartService.clearCart();
          this.cartService.toggleCart(false);
          this.checkoutForm.resetForm();
        } else {
          this.toastService.show(res.error || 'حدث خطأ غير متوقع', 'error');
          this.checkoutForm.isSubmitting = false;
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.show('تعذر الاتصال بالخادم.', 'error');
        this.checkoutForm.isSubmitting = false;
      }
    });
  }
}
