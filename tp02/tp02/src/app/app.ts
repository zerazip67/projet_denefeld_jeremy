import { Component } from '@angular/core';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionRecap } from './components/pollution-recap/pollution-recap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollutionForm, PollutionRecap],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  pollution: any = null;

  afficherRecap(donnees: any) {
    this.pollution = donnees;
  }

  nouvelleDeclaration() {
    this.pollution = null;
  }
}
