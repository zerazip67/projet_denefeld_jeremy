import { Routes } from '@angular/router';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionRecap } from './components/pollution-recap/pollution-recap';

export const routes: Routes = [
  { path: '', component: PollutionForm },
  { path: 'recap', component: PollutionRecap },
];
