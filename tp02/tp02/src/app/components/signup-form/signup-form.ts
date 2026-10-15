import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { SignupResponse } from '../../models/signup';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly signupService = inject(SignupService);

  @Output() inscriptionReussie = new EventEmitter<void>();

  loading = false;
  successMessage = '';
  errorMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    this.form.markAllAsTouched();
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.signupService.signup(this.form.getRawValue()).subscribe({
      next: (response: SignupResponse) => {
        this.loading = false;
        this.successMessage = `Compte créé pour ${response.name} (${response.email}).`;
        this.form.reset();
        this.inscriptionReussie.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          typeof error.error?.message === 'string'
            ? error.error.message
            : `L'inscription a échoué (HTTP ${error.status || 'inconnu'}).`;
      },
    });
  }
}
