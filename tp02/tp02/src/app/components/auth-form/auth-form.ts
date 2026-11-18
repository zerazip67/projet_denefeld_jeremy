import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SignupResponse } from '../../models/signup';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);

  @Output() authentificationReussie = new EventEmitter<void>();

  mode: 'login' | 'signup' = 'login';
  loading = false;
  successMessage = '';
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
    this.successMessage = '';
    this.errorMessage = '';
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.successMessage = '';
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
      next: (response: SignupResponse) => {
        this.loading = false;
        this.successMessage =
          this.mode === 'signup'
            ? `Compte créé pour ${response.name} (${response.email}).`
            : `Connexion réussie pour ${response.name}.`;
        this.form.reset();
        this.authentificationReussie.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          typeof error.error?.message === 'string'
            ? error.error.message
            : `${this.mode === 'login' ? 'La connexion' : "L'inscription"} a échoué (HTTP ${error.status || 'inconnu'}).`;
      },
    });
  }
}
