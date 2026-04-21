import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;

  private userProfile = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfile.asObservable();

  setUser(user: any) {
    this.userProfile.next(user);
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  getProfile() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/profile/`, { headers });
  }

  setProfile(data: any) {
    this.userProfile.next(data);
  }

  logout() {
  localStorage.removeItem('access_token');
  
  this.userProfile.next(null);
  
  this.router.navigate(['/login']);
}
}
