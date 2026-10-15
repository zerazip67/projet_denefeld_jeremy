import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm {
  private fb = inject(FormBuilder);

  @Output() declarationEnvoyee = new EventEmitter<any>();

  formulaire = this.fb.group({
    titre: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    lieu: ['', Validators.required],
    latitude: [
      null as number | null,
      [Validators.required, Validators.min(-90), Validators.max(90)],
    ],
    longitude: [
      null as number | null,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ],
    photo: [''],
  });

  envoyer() {
    this.formulaire.markAllAsTouched();

    if (this.formulaire.valid) {
      this.declarationEnvoyee.emit(this.formulaire.getRawValue());
    }
  }
}
