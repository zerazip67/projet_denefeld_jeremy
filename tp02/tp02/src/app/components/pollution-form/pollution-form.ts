import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pollution, PollutionInput } from '../../models/pollution';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() pollution: Pollution | null = null;
  @Output() declarationEnvoyee = new EventEmitter<PollutionInput>();

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

  ngOnChanges() {
    if (this.pollution) {
      this.formulaire.patchValue(this.pollution);
    } else {
      this.formulaire.reset({
        titre: '',
        type: '',
        description: '',
        date: '',
        lieu: '',
        latitude: null,
        longitude: null,
        photo: '',
      });
    }
  }

  envoyer() {
    this.formulaire.markAllAsTouched();

    if (this.formulaire.valid) {
      this.declarationEnvoyee.emit(this.formulaire.getRawValue() as PollutionInput);
    }
  }
}
