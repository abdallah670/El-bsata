import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Lock } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-login-page">
      <div class="login-card">
        <div class="login-logo">
          <div class="login-logo-icon">🍲</div>
          <h2 class="login-logo-title">الوصول للإدارة</h2>
          <p class="login-logo-sub">يرجى تسجيل الدخول لمتابعة الطلبات</p>
        </div>

        <div *ngIf="loginError" class="login-error">{{ loginError }}</div>

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label class="form-label">اسم المستخدم:</label>
            <input type="text" class="form-input" [(ngModel)]="username" name="username" required dir="ltr" [disabled]="isSubmitting" />
          </div>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label">كلمة المرور:</label>
            <input type="password" class="form-input" [(ngModel)]="password" name="password" required dir="ltr" [disabled]="isSubmitting" />
          </div>

          <button type="submit" class="btn-submit" [disabled]="isSubmitting">
            <lucide-icon [img]="Lock" size="16"></lucide-icon>
            {{ isSubmitting ? 'جاري التحقق...' : 'دخول آمن' }}
          </button>
        </form>

        <div class="login-footer">
          <button class="back-link" (click)="onBack.emit()" [disabled]="isSubmitting">العودة للموقع الرئيسي</button>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  @Output() onLogin = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  username = '';
  password = '';
  loginError = '';
  isSubmitting = false;

  readonly Lock = Lock;

  constructor(private toastService: ToastService, private authService: AuthService) {}

  login() {
    this.isSubmitting = true;
    this.loginError = '';
    
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.show('تم تسجيل الدخول بنجاح للوحة المراقبة!', 'success');
        this.onLogin.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.loginError = err.error?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.';
        this.toastService.show('فشل تسجيل الدخول', 'error');
      }
    });
  }
}
