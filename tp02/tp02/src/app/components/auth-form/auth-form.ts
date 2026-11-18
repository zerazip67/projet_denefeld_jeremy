import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);

  mode: 'login' | 'signup' = 'login';
  loading = false;
  errorMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  changerMode(): void {
    if (this.loading) {
      return;
    }

    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.form.controls.name.setValidators(
      this.mode === 'signup' ? Validators.required : null,
    );
    this.form.controls.password.setValidators(
      this.mode === 'signup'
        ? [Validators.required, Validators.minLength(8)]
        : Validators.required,
    );
    this.form.reset();
    this.form.controls.name.updateValueAndValidity();
    this.form.controls.password.updateValueAndValidity();
    this.errorMessage = '';
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.errorMessage = '';

    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    const { name, email, password } = this.form.getRawValue();
    const request =
      this.mode === 'signup'
        ? this.userService.create({ name, email, password })
        : this.userService.login({ email, password });

    request.subscribe({
      next: () => {
        this.loading = false;
        this.authService.setAuthenticated(true);
        this.form.reset();
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const destination =
          returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/dashboard';
        void this.router.navigateByUrl(destination);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          typeof error.error?.message === 'string'
            ? error.error.message
            : `${this.mode === 'login' ? 'La connexion' : "L'inscription"} a échoué (HTTP ${error.status || 'inconnu'}).`;
        this.changeDetector.markForCheck();
      },
    });
  }
}
