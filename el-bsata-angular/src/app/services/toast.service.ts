import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastState = signal<Toast | null>(null);
  
  show(message: string, type: ToastType = 'success') {
    this.toastState.set({ message, type });
    setTimeout(() => {
      this.toastState.set(null);
    }, 5000);
  }
}
