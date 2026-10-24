import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { SignupForm } from './components/signup-form/signup-form';
import { Pollution, PollutionInput } from './models/pollution';
import { PollutionService } from './services/pollution.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, PollutionForm, SignupForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly pollutionService = inject(PollutionService);

  inscrit = false;
  pollutions: Pollution[] = [];
  pollutionSelectionnee: Pollution | null = null;
  pollutionEnEdition: Pollution | null = null;
  formulaireOuvert = false;
  filtreTexte = '';
  filtreType = '';
  chargement = false;
  enregistrement = false;
  erreur = '';

  terminerInscription() {
    this.inscrit = true;
    this.chargerPollutions();
  }

  get pollutionsFiltrees(): Pollution[] {
    const texte = this.filtreTexte.trim().toLocaleLowerCase();
    return this.pollutions.filter((pollution) => {
      const correspondAuTexte =
        !texte ||
        pollution.titre.toLocaleLowerCase().includes(texte) ||
        pollution.lieu.toLocaleLowerCase().includes(texte);
      return correspondAuTexte && (!this.filtreType || pollution.type === this.filtreType);
    });
  }

  chargerPollutions() {
    this.chargement = true;
    this.erreur = '';
    this.pollutionService.getAll().subscribe({
      next: (pollutions) => {
        this.pollutions = pollutions;
        this.chargement = false;
      },
      error: (error: unknown) => this.afficherErreur(error),
    });
  }

  enregistrerPollution(pollution: PollutionInput) {
    this.enregistrement = true;
    this.erreur = '';

    const requete = this.pollutionEnEdition
      ? this.pollutionService.update(this.pollutionEnEdition.id, pollution)
      : this.pollutionService.create(pollution);

    requete.subscribe({
      next: (pollutionEnregistree) => {
        if (this.pollutionEnEdition) {
          this.pollutions = this.pollutions.map((element) =>
            element.id === pollutionEnregistree.id ? pollutionEnregistree : element,
          );
        } else {
          this.pollutions = [pollutionEnregistree, ...this.pollutions];
        }
        this.annulerEdition();
        this.enregistrement = false;
      },
      error: (error: unknown) => {
        this.enregistrement = false;
        this.afficherErreur(error);
      },
    });
  }

  supprimerPollution(pollution: Pollution) {
    this.erreur = '';
    this.pollutionService.delete(pollution.id).subscribe({
      next: () => {
        this.pollutions = this.pollutions.filter((element) => element.id !== pollution.id);
        if (this.pollutionSelectionnee?.id === pollution.id) {
          this.pollutionSelectionnee = null;
        }
      },
      error: (error: unknown) => this.afficherErreur(error),
    });
  }

  afficherDetail(pollution: Pollution) {
    this.erreur = '';
    this.pollutionService.getById(pollution.id).subscribe({
      next: (detail) => {
        this.pollutionSelectionnee = detail;
        this.pollutionEnEdition = null;
      },
      error: (error: unknown) => this.afficherErreur(error),
    });
  }

  modifierPollution(pollution: Pollution) {
    this.pollutionEnEdition = pollution;
    this.pollutionSelectionnee = null;
    this.formulaireOuvert = true;
    this.erreur = '';
  }

  nouvellePollution() {
    this.pollutionEnEdition = null;
    this.pollutionSelectionnee = null;
    this.formulaireOuvert = true;
    this.erreur = '';
  }

  annulerEdition() {
    this.pollutionEnEdition = null;
    this.pollutionSelectionnee = null;
    this.formulaireOuvert = false;
  }

  private afficherErreur(error: unknown) {
    this.chargement = false;
    if (error instanceof HttpErrorResponse) {
      this.erreur = `La requête a échoué (${error.status || 'réseau indisponible'}).`;
    } else {
      this.erreur = 'Une erreur inattendue est survenue.';
    }
  }
}
