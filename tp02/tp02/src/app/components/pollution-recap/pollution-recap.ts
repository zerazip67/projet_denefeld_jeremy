import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css',
})
export class PollutionRecap {
  @Input() pollution: any;

  @Output() nouvelleDeclaration = new EventEmitter<void>();
}
