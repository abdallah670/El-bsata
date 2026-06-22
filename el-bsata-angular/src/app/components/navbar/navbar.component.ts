import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Lock, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-left">
          <img src="assets/logo.png" alt="البساطة" class="navbar-logo" />
          <span class="navbar-brand">البساطة</span>
          <span class="navbar-badge">لفواكة اللحمة </span>
        </div>

        <div class="navbar-links">
          <a href="#section-menu" class="nav-link">القائمة</a>
          <a href="#section-about" class="nav-link">عن المطعم</a>
          <a href="#section-contact" class="nav-link">اتصل بنا</a>
        </div>

        <div class="navbar-right">
          <ng-container *ngIf="isAdminLoggedIn; else loginBtn">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="btn btn-admin" (click)="viewAdmin.emit()" title="لوحة مراقبة الطلبات">
                <span style="position: relative; display: flex; width: 8px; height: 8px; margin-left: 4px;">
                  <span style="animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 9999px; background-color: #34d399; opacity: 0.75;"></span>
                  <span style="position: relative; display: inline-flex; border-radius: 9999px; height: 8px; width: 8px; background-color: #10b981;"></span>
                </span>
                مراقبة الطلبات
                <span style="background-color: var(--gold-main); color: white; font-size: 10px; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-weight: bold; margin-right: 4px;">{{ ordersCount }}</span>
              </button>
              <button class="btn btn-danger-ghost" (click)="logout.emit()" title="تسجيل الخروج">
                <lucide-icon [img]="LogOut" size="13"></lucide-icon>
                <span>خروج</span>
              </button>
            </div>
          </ng-container>
          <ng-template #loginBtn>
            <button class="btn btn-ghost" (click)="viewLogin.emit()">
              <lucide-icon [img]="Lock" size="13" color="var(--gold-main)"></lucide-icon>
              تسجيل دخول 🔒
            </button>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() isAdminLoggedIn = false;
  @Input() ordersCount = 0;
  @Output() viewAdmin = new EventEmitter<void>();
  @Output() viewLogin = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  readonly Lock = Lock;
  readonly LogOut = LogOut;
}
