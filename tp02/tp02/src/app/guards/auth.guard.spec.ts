import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  template: '',
})
class RouteStub {}

describe('authentication guards', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'auth', component: RouteStub, canActivate: [guestGuard] },
          { path: 'dashboard', component: RouteStub, canActivate: [authGuard] },
        ]),
      ],
    }).compileComponents();
  });

  it('redirects guests to authentication and preserves their destination', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/dashboard');

    expect(router.url).toBe('/auth?returnUrl=%2Fdashboard');
  });

  it('redirects authenticated users away from the authentication page', async () => {
    TestBed.inject(AuthService).setAuthenticated(true);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/auth');

    expect(router.url).toBe('/dashboard');
  });
});
