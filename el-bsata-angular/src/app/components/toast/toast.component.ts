import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, CheckCircle2, Compass, BadgeAlert } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem) scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(1rem) scale(0.95)' }))
      ])
    ])
  ],
  template: `
    <div class="toast-container" *ngIf="toastService.toastState() as toast" [@slideUp]>
      <div class="toast" [ngClass]="toast.type">
        <lucide-icon *ngIf="toast.type === 'success'" [img]="CheckCircle2" class="toast-icon"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'info'" [img]="Compass" class="toast-icon"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'error'" [img]="BadgeAlert" class="toast-icon"></lucide-icon>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `
})
export class ToastComponent {
  readonly CheckCircle2 = CheckCircle2;
  readonly Compass = Compass;
  readonly BadgeAlert = BadgeAlert;

  constructor(public toastService: ToastService) {}
}
