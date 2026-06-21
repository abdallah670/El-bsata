import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MenuCategory, MenuItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`);
  }

  getItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`).pipe(
      map(items => items.map(item => this.MapMenuItem(item)))
    );
  }

  searchItems(search?: string, category?: string): Observable<MenuItem[]> {
    const params: any = {};
    if (search) params.search = search;
    if (category && category !== 'all') params.category = category;
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items/search`, { params }).pipe(
      map(items => items.map(item => this.MapMenuItem(item)))
    );
  }
  MapMenuItem(item: any): MenuItem {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      image: this.getImageUrl(item.image)
    };
  }
  getImageUrl(image: string): string {
    if (!image) {
      return 'assets/default-image.jpg'; // Return a default image if none is provided
    }
    if(image.startsWith('http://') || image.startsWith('https://')) {
      return image; // Return the full URL if it's already a complete URL
    }
    if(image.startsWith('/images/')) {
      return `${environment.resourceUrl}${image}`; // Prepend the resource URL if it's a relative path
    }
    return `${environment.resourceUrl}/images/${image}`;
  }
}
