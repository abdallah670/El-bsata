import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule, Inbox, Eye, Map } from 'lucide-angular';
import { Order } from '../../models/models';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="admin-page">
      <div class="container">
        
        <div class="admin-header">
          <h2 class="admin-title">
            <div class="pulse-dot"></div>
            لوحة المراقبة الفورية للطلبات
          </h2>
          <button class="back-link" (click)="onBack.emit()" style="margin-top: 0.5rem; display: inline-block;">
            &larr; العودة للمطعم
          </button>
        </div>

        <div class="admin-grid">
          <!-- Left pane: Order list -->
          <div class="admin-panel">
            <div class="admin-panel-header">
              <span class="admin-panel-title">
                <lucide-icon [img]="Inbox" size="16"></lucide-icon>
                الطلبات الواردة ({{ orders.length }})
              </span>
              <button class="btn-ghost" (click)="loadOrders()" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;">تحديث الداتا</button>
            </div>
            
            <div class="admin-panel-body">
              <div *ngIf="orders.length === 0" class="no-orders">
                <lucide-icon [img]="Inbox" size="30" color="var(--stone-800)" style="margin:0 auto;"></lucide-icon>
                <p>لا توجد طلبات في النظام حتى الآن.</p>
              </div>

              <div 
                *ngFor="let order of orders" 
                class="order-card" 
                [class.active]="selectedOrder?.id === order.id"
                (click)="selectOrder(order)">
                
                <div class="order-card-header">
                  <span class="order-id">{{ order.id }}</span>
                  <span class="status-badge" [ngClass]="'status-' + order.status.toLowerCase()">
                    {{ order.status === 'Sent' ? 'تم الإرسال ✓' : order.status === 'Pending' ? 'قيد المعالجة ⌛' : 'فشل الإرسال ❌' }}
                  </span>
                </div>

                <div class="order-customer">{{ order.customer.name }}</div>
                <div class="order-phone">{{ order.customer.phone }}</div>
                <div class="order-address">{{ order.customer.address }}</div>

                <div class="order-meta">
                  <span class="order-total">{{ order.totalPrice }} ج.م</span>
                  <span class="order-time">{{ formatDate(order.createdAt) }}</span>
                </div>

                <div *ngIf="hasCoordinates(order)" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--stone-800);">
                  <a [href]="getMapUrl(order)" 
                     target="_blank" 
                     class="order-map-btn"
                     (click)="$event.stopPropagation()">
                    <lucide-icon [img]="Map" size="12" style="display:inline; vertical-align:-2px;"></lucide-icon>
                    تتبع GPS على الخريطة
                  </a>
                </div>

              </div>
            </div>
          </div>

          <!-- Right pane: Email Preview -->
          <div class="admin-panel">
            <div class="admin-panel-header">
              <span class="admin-panel-title">
                <lucide-icon [img]="Eye" size="16"></lucide-icon>
                معاينة البريد المُرسل
              </span>
            </div>
            
            <div style="background: white; padding: 0;">
              <div *ngIf="!selectedOrder" class="email-placeholder">
                <lucide-icon [img]="Eye" size="30" color="#ccc"></lucide-icon>
                <p>اختر طلباً من القائمة لعرض معاينة الإيميل المُرسل للمطبخ</p>
              </div>

              <div *ngIf="loadingDetails" class="email-placeholder">
                <p>جاري تحميل التفاصيل...</p>
              </div>

              <iframe 
                *ngIf="selectedOrder && !loadingDetails" 
                class="email-preview" 
                [srcdoc]="getSafeHtml(selectedOrder.emailLog || '')">
              </iframe>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  @Output() onBack = new EventEmitter<void>();

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loadingDetails = false;
  private intervalId: any;

  readonly Inbox = Inbox;
  readonly Eye = Eye;
  readonly Map = Map;

  constructor(
    private orderService: OrderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.intervalId = setInterval(() => this.loadOrders(), 10000); // 10s refresh
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  selectOrder(order: Order) {
    this.loadingDetails = true;
    this.orderService.getOrderById(order.id).subscribe({
      next: (fullOrder) => {
        this.selectedOrder = fullOrder;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Failed to load order details', err);
        this.loadingDetails = false;
      }
    });
  }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('ar-EG');
  }

  hasCoordinates(order: Order): boolean {
    return !!order.customer.coordinates && order.customer.coordinates.latitude != null && order.customer.coordinates.longitude != null;
  }

  getMapUrl(order: Order): string {
    const c = order.customer.coordinates;
    if (!c || c.latitude == null || c.longitude == null) return '#';
    return `https://maps.google.com/?q=${c.latitude},${c.longitude}`;
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
