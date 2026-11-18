import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, SignupRequest, SignupResponse } from '../models/signup';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<SignupResponse[]> {
    return this.http.get<SignupResponse[]>(this.usersUrl);
  }

  create(user: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(this.usersUrl, user);
  }

  login(credentials: LoginRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.usersUrl}/login`, credentials);
  }
}
