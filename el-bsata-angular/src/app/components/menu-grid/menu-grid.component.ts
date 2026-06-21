import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X, ListFilter, Plus, BadgeAlert } from 'lucide-angular';
import { MenuCategory, MenuItem } from '../../models/models';
import { CartService } from '../../services/cart.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <section id="section-menu" class="cat-section" style="margin-top: 2rem;">
      <div class="filter-bar">
        <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%; max-width: max-content;">
          <span class="filter-label" style="display: none; @media (min-width: 640px) { display: flex; }">
            <lucide-icon [img]="ListFilter" size="16" color="var(--gold-light)"></lucide-icon>
            فرز وتصفية القائمة:
          </span>
          <select class="filter-select" [(ngModel)]="selectedCategory" (ngModelChange)="onFilterChange()" style="flex: 1;">
            <option value="all">كل الأقسام والمأكولات</option>
            <option *ngFor="let cat of categories" [value]="cat.id">
              {{ cat.icon }} {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="search-wrap">
          <input type="text" class="search-input" placeholder="ابحث عن كبدة، ممبار، طاجن..." [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()" />
          <lucide-icon [img]="Search" size="16" class="search-icon"></lucide-icon>
          <button class="search-clear" *ngIf="searchQuery" (click)="clearSearch()">
            <lucide-icon [img]="X" size="16"></lucide-icon>
          </button>
        </div>
      </div>

      <ng-container *ngFor="let cat of categories">
        <div *ngIf="getCategoryItems(cat.id).length > 0" class="cat-section" [id]="cat.id">
          <div class="cat-header">
            <span class="cat-icon">{{ cat.icon }}</span>
            <h2 class="cat-title">{{ cat.label }}</h2>
            <div class="cat-rule"></div>
          </div>
          <p class="cat-desc">{{ cat.desc }}</p>

          <div class="menu-grid">
            <div class="menu-card" *ngFor="let item of getCategoryItems(cat.id)">
              <div class="card-top">
                <div class="card-name-row">
                  <h3 class="card-name">{{ item.name }}</h3>
                  <span class="card-price">{{ item.price ? item.price + ' ج.م' : 'غير متوفر' }}</span>
                </div>
                <p class="card-desc">{{ item.description }}</p>
              </div>
              
              <div>
                <img [src]="item.image" [alt]="item.name" class="card-img" />
                <button class="btn-add-cart" *ngIf="!isAdminLoggedIn" (click)="addToCart(item)">
                  <lucide-icon [img]="Plus" size="14" style="stroke-width: 3px;"></lucide-icon>
                  <span>أضف للطلب الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <div *ngIf="items.length === 0 && !loading" class="empty-state">
        <lucide-icon [img]="BadgeAlert" size="40" color="var(--text-muted)" style="margin: 0 auto 0.75rem; display: block;"></lucide-icon>
        <p>عذراً، لم نعثر على أي مأكولات مطابقة لبحثك.</p>
        <button class="btn-link" (click)="resetFilters()">عرض كل القائمة مجدداً</button>
      </div>

      <div *ngIf="loading" class="empty-state">
        <p>جاري تحميل القائمة...</p>
      </div>
    </section>
  `
})
export class MenuGridComponent implements OnInit {
  @Input() categories: MenuCategory[] = [];
  items: MenuItem[] = [];
  loading = false;
  @Input() isAdminLoggedIn = false;

  selectedCategory = 'all';
  searchQuery = '';

  readonly Search = Search;
  readonly X = X;
  readonly ListFilter = ListFilter;
  readonly Plus = Plus;
  readonly BadgeAlert = BadgeAlert;

  constructor(private cartService: CartService, private menuService: MenuService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.menuService.searchItems(this.searchQuery || undefined, this.selectedCategory).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load menu items', err);
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.loadItems();
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadItems();
  }

  resetFilters() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.loadItems();
  }

  getCategoryItems(categoryId: string) {
    return this.items.filter(i => i.category === categoryId);
  }

  addToCart(item: MenuItem) {
    this.cartService.addToCart(item);
  }
}
