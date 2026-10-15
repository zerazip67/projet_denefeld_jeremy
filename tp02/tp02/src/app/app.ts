import { Component } from '@angular/core';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionRecap } from './components/pollution-recap/pollution-recap';
import { SignupForm } from './components/signup-form/signup-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollutionForm, PollutionRecap, SignupForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  inscrit = false;
  pollution: any = null;

  terminerInscription() {
    this.inscrit = true;
  }

  afficherRecap(donnees: any) {
    this.pollution = donnees;
  }

  nouvelleDeclaration() {
    this.pollution = null;
  }
}
