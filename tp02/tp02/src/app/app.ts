import { Component } from '@angular/core';
import { PollutionDashboard } from './components/pollution-dashboard/pollution-dashboard';
import { AuthForm } from './components/auth-form/auth-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthForm, PollutionDashboard],
  templateUrl: './app.html',
})
export class App {
  inscrit = false;

  terminerInscription() {
    this.inscrit = true;
  }
}
