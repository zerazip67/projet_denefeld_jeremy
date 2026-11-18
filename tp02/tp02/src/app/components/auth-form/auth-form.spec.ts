import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthForm } from './auth-form';

describe('AuthForm', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('authenticates with the login endpoint', () => {
    const fixture = TestBed.createComponent(AuthForm);
    const component = fixture.componentInstance;
    let authenticated = false;
    component.authentificationReussie.subscribe(() => {
      authenticated = true;
    });

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

    expect(authenticated).toBe(true);
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
