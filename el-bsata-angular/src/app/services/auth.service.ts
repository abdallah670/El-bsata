import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.authStatus.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.authStatus.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
