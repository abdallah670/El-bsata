import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Phone, Compass } from 'lucide-angular';
import { CustomerInfo } from '../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <form (ngSubmit)="submitForm()" class="checkout-form">
      <h4 class="section-label">بيانات مستلم وموقع التوصيل</h4>

      <div class="form-group">
        <label class="form-label">
          <lucide-icon [img]="User" size="12"></lucide-icon>
          الاسم الكامل للمستلم: <span class="required">*</span>
        </label>
        <input type="text" class="form-input" required placeholder="مثال: أحمد محمد علي" [(ngModel)]="customerName" name="customerName" />
      </div>

      <div class="form-group">
        <label class="form-label">
          <lucide-icon [img]="Phone" size="12"></lucide-icon>
          رقم الهاتف للتواصل للتأكيد: <span class="required">*</span>
        </label>
        <input type="tel" class="form-input" dir="ltr" required placeholder="مثال: 01234567890" [(ngModel)]="customerPhone" name="customerPhone" />
      </div>

      <div class="gps-box">
        <div class="gps-box-header">
          <span class="gps-label">
            <lucide-icon [img]="Compass" size="14" [class.spinner]="isGpsLoading"></lucide-icon>
            الحصول على موقع GPS الدقيق: <span class="required">*</span>
          </span>
          
          <button type="button" class="btn-gps" (click)="getLocation()" [disabled]="isGpsLoading">
            <lucide-icon [img]="Compass" size="12"></lucide-icon>
            {{ isGpsLoading ? 'جاري التحديد...' : 'تحديد موقعي' }}
          </button>
        </div>

        <div class="form-group" style="margin-top: 0.5rem; margin-bottom: 0;">
          <input type="text" class="form-input" style="font-size: 0.75rem; padding: 0.4rem 0.6rem;" required placeholder="أو اكتب عنوانك بالتفصيل هنا..." [(ngModel)]="customerAddress" name="customerAddress" />
        </div>

        <div *ngIf="latitude" class="gps-coords">
          <lucide-icon [img]="Compass" size="14"></lucide-icon>
          <span>{{ latitude | number:'1.4-6' }}, {{ longitude | number:'1.4-6' }}</span>
          <a [href]="'https://maps.google.com/?q=' + latitude + ',' + longitude" target="_blank">فتح الخريطة</a>
        </div>
        <p class="gps-status" *ngIf="gpsStatus">{{ gpsStatus }}</p>
      </div>

      <div class="form-group" style="margin-top: 1rem;">
        <label class="form-label">ملاحظات إضافية:</label>
        <textarea class="form-textarea" placeholder="مثال: بدون بصل، زيادة طحينة..." [(ngModel)]="orderNotes" name="orderNotes"></textarea>
      </div>

      <button type="submit" class="btn-submit" [disabled]="isSubmitting">
        <span *ngIf="isSubmitting" class="spinner"></span>
        {{ isSubmitting ? 'جاري تأكيد الطلب...' : 'إتمام الطلب الآن' }}
      </button>
    </form>
  `
})
export class CheckoutFormComponent {
  @Output() onSubmit = new EventEmitter<CustomerInfo>();

  customerName = '';
  customerPhone = '';
  customerAddress = '';
  orderNotes = '';
  
  isGpsLoading = false;
  latitude: number | null = null;
  longitude: number | null = null;
  gpsAccuracy: number | null = null;
  gpsStatus = '';
  
  isSubmitting = false; // typically controlled by parent, but we can manage local state

  readonly User = User;
  readonly Phone = Phone;
  readonly Compass = Compass;

  constructor(private toastService: ToastService) {}

  getLocation() {
    if (!navigator.geolocation) {
      this.toastService.show('مستعرض الويب الخاص بك لا يدعم تحديد الموقع الجغرافي GPS', 'error');
      return;
    }

    this.isGpsLoading = true;
    this.gpsStatus = 'جاري الاتصال بالأقمار الصناعية...';

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.latitude = lat;
        this.longitude = lon;
        this.gpsAccuracy = position.coords.accuracy;
        this.gpsStatus = 'تم تحديد الإحداثيات بنجاح!';
        this.toastService.show('تم الحصول على إحداثيات GPS', 'info');

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=ar`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.display_name || `${data.address?.road || ''} ${data.address?.suburb || ''}, ${data.address?.city || ''}`;
            if (addr.trim()) {
              this.customerAddress = addr;
            }
          }
        } catch (err) {
          // fallback
          if (!this.customerAddress) {
            this.customerAddress = `إحداثيات: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
          }
        } finally {
          this.isGpsLoading = false;
        }
      },
      (error) => {
        this.isGpsLoading = false;
        this.gpsStatus = 'بالرجاء كتابة العنوان يدوياً';
        this.toastService.show('فشل الحصول على موقعك الجغرافي', 'error');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  submitForm() {
    if (!this.customerName.trim() || !this.customerPhone.trim() || !this.customerAddress.trim()) {
      this.toastService.show('يرجى ملء الاسم الكامل والهاتف وعنوان التوصيل', 'error');
      return;
    }

    this.onSubmit.emit({
      name: this.customerName,
      phone: this.customerPhone,
      address: this.customerAddress,
      coordinates: {
        latitude: this.latitude,
        longitude: this.longitude,
        accuracy: this.gpsAccuracy
      },
      notes: this.orderNotes
    });
  }

  resetForm() {
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.orderNotes = '';
    this.latitude = null;
    this.longitude = null;
    this.gpsAccuracy = null;
    this.gpsStatus = '';
    this.isSubmitting = false;
  }
}
