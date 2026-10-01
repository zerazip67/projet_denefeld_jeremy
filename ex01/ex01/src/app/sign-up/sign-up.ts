import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  formData = {
    login: '',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit() {
    console.log('Formulaire valide, données envoyées :', this.formData);
  }
}
