import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <header class="hero">
      <div class="container">
        <span class="hero-badge">🇪🇬 مطعم مصري شعبي فاخر</span>
        <h1><span>البساطة</span></h1>
        <p class="hero-sub">لفواكة <em>اللحمة والمخاصي والكوارع</em> · نكهات عريقة تجلب قلب القاهرة لعندك</p>
        <div class="hero-divider"></div>
        <p class="hero-note">🚚 متوفر التوصيل الفوري مع تقنية تتبع خريطة GPS للمندوب</p>
      </div>
    </header>
  `
})
export class HeroComponent {}
