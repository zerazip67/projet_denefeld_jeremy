import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PollutionForm } from '../pollution-form/pollution-form';
import { HighlightPollutionDirective } from '../../directives/highlight-pollution.directive';
import { Pollution, PollutionInput } from '../../models/pollution';
import { PollutionLevelPipe } from '../../pipes/pollution-level.pipe';
import { PollutionService } from '../../services/pollution.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pollution-dashboard',
  standalone: true,
  imports: [FormsModule, PollutionForm, HighlightPollutionDirective, PollutionLevelPipe],
  templateUrl: './pollution-dashboard.html',
  styleUrl: './pollution-dashboard.css',
})
export class PollutionDashboard implements OnInit {
  private readonly pollutionService = inject(PollutionService);
  private readonly userService = inject(UserService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  pollutions: Pollution[] = [];
  pollutionSelectionnee: Pollution | null = null;
  pollutionEnEdition: Pollution | null = null;
  formulaireOuvert = false;
  filtreTexte = '';
  filtreType = '';
  chargement = false;
  enregistrement = false;
  nombreUtilisateurs = 0;
  erreur = '';

  ngOnInit() {
    this.chargerPollutions();
    this.userService.getAll().subscribe({
      next: (users) => {
        this.nombreUtilisateurs = users.length;
        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => this.afficherErreur(error),
    });
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
        this.changeDetector.markForCheck();
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
        this.changeDetector.markForCheck();
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
        this.changeDetector.markForCheck();
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
        this.changeDetector.markForCheck();
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
    this.changeDetector.markForCheck();
  }
}
