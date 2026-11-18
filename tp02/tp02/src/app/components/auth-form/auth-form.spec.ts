import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthForm } from './auth-form';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  template: '',
})
class DashboardStub {}

describe('AuthForm', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'dashboard', component: DashboardStub }]),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('authenticates with the login endpoint and redirects to the dashboard', async () => {
    const fixture = TestBed.createComponent(AuthForm);
    const component = fixture.componentInstance;

    component.form.setValue({
      name: '',
      email: 'pollueur@example.com',
      password: 'motdepasse',
    });
    component.submit();

    const request = httpTesting.expectOne((req) => req.url.endsWith('/users/login'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'pollueur@example.com',
      password: 'motdepasse',
    });
    request.flush({ id: 1, name: 'Pollueur', email: 'pollueur@example.com' });

    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/dashboard');
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(true);
  });

  it('requires a name and a long password when switching to signup', () => {
    const fixture = TestBed.createComponent(AuthForm);
    const component = fixture.componentInstance;

    component.changerMode();
    component.form.setValue({
      name: '',
      email: 'pollueur@example.com',
      password: 'court',
    });

    expect(component.form.invalid).toBe(true);
    httpTesting.expectNone((req) => req.url.endsWith('/users/login'));
  });
});
