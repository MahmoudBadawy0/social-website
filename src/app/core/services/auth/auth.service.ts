import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { Observable } from 'rxjs';
import { EndPoint } from '../../enum/endPoint.enum';
import {
  changePasswordData,
  loginData,
  RegisterData,
} from '../../../shared/interfaces/iauth';
import { environments } from '../../environments/api_environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  decodedToken: any;
  isAuthenticated = signal<boolean>(false);
  private readonly id = inject(PLATFORM_ID);
  private readonly baseUrl = environments.baseUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    if (isPlatformBrowser(this.id)) {
      const token = localStorage.getItem('token');
      this.isAuthenticated.set(!!token);
    }
  }

  signup(signupData: RegisterData): Observable<any> {
    return this.http.post(this.baseUrl + EndPoint.signup, signupData);
  }

  signin(signinData: loginData): Observable<any> {
    return this.http.post(this.baseUrl + EndPoint.signin, signinData);
  }

  changePassword(changePasswordData: changePasswordData): Observable<any> {
    return this.http.patch(
      this.baseUrl + EndPoint.changePassword,
      changePasswordData
    );
  }

  tokenDecode() {
    if (localStorage.getItem('token') !== null) {
      this.decodedToken = jwtDecode(localStorage.getItem('token')!);
    }
  }

  logOut(): void {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
    this.decodedToken = null;
    this.isAuthenticated.set(false);
  }
}
