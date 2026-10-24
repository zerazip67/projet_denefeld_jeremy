import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignupRequest, SignupResponse } from '../models/signup';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly http = inject(HttpClient);
  private readonly signupUrl = `${environment.apiUrl}/auth/signup`;

  signup(user: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(this.signupUrl, user);
  }
}
