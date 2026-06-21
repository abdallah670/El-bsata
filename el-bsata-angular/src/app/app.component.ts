import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingBag } from 'lucide-angular';

import { MenuService } from './services/menu.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { AuthService } from './services/auth.service';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { MenuGridComponent } from './components/menu-grid/menu-grid.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { ToastComponent } from './components/toast/toast.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

import { MenuCategory, MenuItem } from './models/models';

type ViewState = 'home' | 'login' | 'admin';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    NavbarComponent,
    HeroComponent,
    MenuGridComponent,
    CartDrawerComponent,
    ToastComponent,
    AdminLoginComponent,
    AdminDashboardComponent
  ],
  template: `
    <app-navbar
      *ngIf="currentView === 'home'"
      [isAdminLoggedIn]="isAdminLoggedIn"
      [ordersCount]="ordersCount"
      (viewAdmin)="currentView = 'admin'"
      (viewLogin)="currentView = 'login'"
      (logout)="logout()"
    ></app-navbar>

    <div *ngIf="currentView === 'home'" class="page-main">
      <app-hero></app-hero>
      
      <main class="container" style="margin-top: 2rem;">
        <app-menu-grid [categories]="categories" [isAdminLoggedIn]="isAdminLoggedIn"></app-menu-grid>

        <!-- About Section -->
        <section class="info-section" id="section-about">
          <div class="info-card" style="max-width: 56rem; margin: 0 auto;">
            <h2 class="info-title"><span>ℹ️</span> قصة مطعم البساطة</h2>
            <div class="info-text">
              <p style="margin-bottom: 1rem;">مطعم <strong> البساطة لفواكة اللحمة</strong> تم تأسيسه ليكون ملتقى عشاق الأكلات الشعبية من فواكه اللحوم والمخاصي والممبار لحلويات اللحوم الشرقية التي تبث الدفء والنشاط بقلوب زوارنا.</p>
              <p>نعمل بأدق المعايير الصحية ونشتهر بالتتبيلة الحارة المصنوعة يدوياً لتقدم يومياً طازجة. نحن لا نصنع فقط طعاماً، بل نرسل لك طبقاً يحمل ذكريات وتراث العراقة المصرية مع جودة وراحة طلبها لبيتك بلمسة واحدة.</p>
              <p class="info-hours">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                نستقبل طلباتكم يومياً من الساعة ١٢:٠٠ ظهراً حتى الساعة ١٢:٠٠ منتصف الليل.
              </p>
            </div>
          </div>
        </section>

        <!-- Contact & Maps Section -->
        <section class="info-section" id="section-contact">
          <div class="contact-grid">
            <div class="info-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 class="info-title"><span class="contact-icon" style="padding:0.25rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span> اتصل بنا للطلبات الهاتفية</h3>
                <div style="margin-top: 1.5rem;">
                  <p class="contact-item"><span class="contact-icon"><svg width="14" height="14"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                   stroke-width="2">
                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                   </span> <strong style="color:white;" dir="ltr">01105188442</strong></p>
                   <p class="contact-item"><span class="contact-icon"><svg width="14" height="14"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                   stroke-width="2">
                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                   </span> <strong style="color:white;" dir="ltr">01105188755</strong></p>
                   <p class="contact-item"><span class="contact-icon"><svg width="14" height="14"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                   stroke-width="2">
                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                   </span> <strong style="color:white;" dir="ltr">01105188765</strong></p>

                   <p class="contact-item"><span class="contact-icon"><svg width="14" height="14"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                   stroke-width="2">
                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                   </span> <strong style="color:white;" dir="ltr">01105187658</strong></p>
                </div>
              </div>
              <div class="contact-footnote">📌 راسلنا عبر واتساب من الزر الأخضر بالأسفل لتلقي عروض الخدمة الممتازة الفورية.</div>
            </div>

          <div class="info-card">
    <h3 class="info-title">
        <span class="contact-icon" style="padding:0.25rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        </span>
        موقع المطعم الرئيسي
    </h3>

    <p style="font-size: 0.85rem; color: #d6d3d1; margin-bottom: 1rem;">
        📍 العنوان: 11 شارع جسر السويس، قسم مصر الجديدة، الزيتون، القاهرة،مصر
    </p>

           <iframe
        src="https://maps.google.com/maps?q=30.0911555,31.3056462&z=17&output=embed"
        width="100%"
        height="300"
        style="border:0; border-radius:12px;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
            </iframe>
      </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p style="font-weight: 700; color: #a8a29e;">مطعم وسط البساطة لفواكة اللحمة وسندوتشات الكبدة والمخاصي  والكوارع</p>
        <p>© {{ currentYear }} - جميع الحقوق محفوظة لجهة الطلب والمسجلة في جمهورية مصر العربية</p>
        <p style="font-size: 0.65rem; margin-top: 0.5rem;">تم تهيئة هذا النظام بالكامل لخدمة الطلب السريع بالبريدq GPS الجغرافي للعملاء.</p>
      </footer>

      <!-- FAB Area -->
      <div class="fab-area">
        <a href="https://wa.me/201105188442?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B" target="_blank" class="fab-whatsapp" title="واتساب الطلبات الفورية">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.7 1.453 5.4 0 9.8-4.4 9.8-9.8.002-2.585-1.002-5.015-2.825-6.84-1.82-1.823-4.25-2.827-6.84-2.828-5.4 0-9.8 4.4-9.8 9.8-.001 2 .51 3.5 1.46 5.06l-.98 3.58 3.68-.96zM17.1 14.8c-.28-.14-1.65-.8-1.9-.9-.25-.09-.43-.14-.6.13-.18.27-.69.9-.85 1.07-.15.18-.32.2-.6.06-.28-.14-1.2-.44-2.28-1.4-.84-.75-1.4-1.68-1.57-1.96-.17-.28-.02-.43.12-.57.13-.13.28-.32.43-.48.14-.17.18-.28.28-.46.1-.18.05-.33-.02-.46-.07-.14-.6-1.45-.82-1.98-.22-.52-.47-.45-.64-.46-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.27-1 .98-1 2.38s1 2.75 1.14 2.95c.14.2 2 3.03 4.8 4.2.67.28 1.2.45 1.6.58.68.21 1.3.18 1.8.1.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.2-.53-.34z"/></svg>
        </a>
        <button class="fab-cart" *ngIf="!isAdminLoggedIn" (click)="cartService.toggleCart(true)">
          <lucide-icon [img]="ShoppingBag" size="25" style="stroke-width:2.5px;"></lucide-icon>
          <span *ngIf="cartService.totalCount() > 0" class="cart-badge">{{ cartService.totalCount() }}</span>
        </button>
      </div>
    </div>

    <!-- Modals & Overlays -->
    <app-cart-drawer></app-cart-drawer>
    <app-toast></app-toast>

    <app-admin-login 
      *ngIf="currentView === 'login'" 
      (onLogin)="currentView = 'admin'"
      (onBack)="currentView = 'home'">
    </app-admin-login>

    <app-admin-dashboard 
      *ngIf="currentView === 'admin'"
      (onBack)="currentView = 'home'">
    </app-admin-dashboard>
  `
})
export class AppComponent implements OnInit {
  currentView: ViewState = 'home';
  isAdminLoggedIn = false;
  ordersCount = 0;
  
  categories: MenuCategory[] = [];
  items: MenuItem[] = [];

  readonly currentYear = new Date().getFullYear();
  readonly ShoppingBag = ShoppingBag;

  constructor(
    public cartService: CartService,
    private menuService: MenuService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Listen to auth state
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isAdminLoggedIn = isLoggedIn;
    });

    // Load Menu from .NET API
    this.menuService.getCategories().subscribe(res => this.categories = res);
    this.menuService.getItems().subscribe(res => this.items = res);

    // Poll orders count for admin badge if logged in or generally
    setInterval(() => {
      if (this.isAdminLoggedIn) {
        this.orderService.getOrders().subscribe({
          next: (orders) => this.ordersCount = orders.length,
          error: (err) => {
            if (err.status === 401) {
              this.logout();
            }
          }
        });
      } else {
        this.ordersCount = 0;
      }
    }, 10000);
  }

  logout() {
    this.authService.logout();
    this.currentView = 'home';
  }
}
