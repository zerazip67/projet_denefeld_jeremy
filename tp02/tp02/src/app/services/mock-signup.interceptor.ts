import {
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignupRequest, SignupResponse } from '../models/signup';

export const mockSignupInterceptor: HttpInterceptorFn = (request, next) => {
  const signupUrl = `${environment.apiUrl}/auth/signup`;

  if (environment.mockApi && request.url === signupUrl && request.method === 'POST') {
    const user = request.body as SignupRequest;
    const response: SignupResponse = {
      id: Date.now(),
      name: user.name,
      email: user.email,
    };

    return of(new HttpResponse({ status: 201, body: response }));
  }

  return next(request);
};
