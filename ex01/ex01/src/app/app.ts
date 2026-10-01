import { Component, signal } from '@angular/core';
import { SignUp } from './sign-up/sign-up';

@Component({
  selector: 'app-root',
  imports: [SignUp],
  template: '<app-sign-up />',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ex01');
}
