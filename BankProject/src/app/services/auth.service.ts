import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../services/index';
import { AuthResponse } from '../models/AuthResponse';
import { LoginRequest, RegisterRequest } from '../models/authRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('image', data.image);

    return this.http.post<AuthResponse>(API.AUTH.REGISTER, formData);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API.AUTH.LOGIN, data);
  }
}
