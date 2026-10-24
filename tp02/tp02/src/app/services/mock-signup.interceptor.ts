import {
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution, PollutionInput } from '../models/pollution';
import { SignupRequest, SignupResponse } from '../models/signup';

const pollutions: Pollution[] = [];
let nextPollutionId = 1;

export const mockSignupInterceptor: HttpInterceptorFn = (request, next) => {
  const signupUrl = `${environment.apiUrl}/auth/signup`;
  const pollutionUrl = `${environment.apiUrl}/pollutions`;

  if (!environment.mockApi) {
    return next(request);
  }

  if (request.url === signupUrl && request.method === 'POST') {
    const user = request.body as SignupRequest;
    const response: SignupResponse = {
      id: Date.now(),
      name: user.name,
      email: user.email,
    };

    return of(new HttpResponse({ status: 201, body: response }));
  }

  if (request.url === pollutionUrl) {
    if (request.method === 'GET') {
      return of(new HttpResponse({ body: [...pollutions] }));
    }

    if (request.method === 'POST') {
      const pollution: Pollution = {
        ...(request.body as PollutionInput),
        id: nextPollutionId++,
      };
      pollutions.push(pollution);
      return of(new HttpResponse({ status: 201, body: pollution }));
    }
  }

  const pollutionMatch = request.url.match(/^.+\/pollutions\/(\d+)$/);
  if (pollutionMatch) {
    const id = Number(pollutionMatch[1]);
    const index = pollutions.findIndex((pollution) => pollution.id === id);

    if (index === -1) {
      return of(new HttpResponse({ status: 404 }));
    }

    if (request.method === 'GET') {
      return of(new HttpResponse({ body: pollutions[index] }));
    }

    if (request.method === 'PUT') {
      const updated: Pollution = {
        ...(request.body as PollutionInput),
        id,
      };
      pollutions[index] = updated;
      return of(new HttpResponse({ body: updated }));
    }

    if (request.method === 'DELETE') {
      pollutions.splice(index, 1);
      return of(new HttpResponse({ status: 204 }));
    }
  }

  return next(request);
};
