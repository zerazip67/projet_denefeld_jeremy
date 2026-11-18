import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appHighlightPollution]',
  standalone: true,
})
export class HighlightPollutionDirective {
  @Input({ required: true }) appHighlightPollution = 0;

  @HostBinding('style.backgroundColor')
  get backgroundColor(): string {
    const level = this.appHighlightPollution;
    if (level <= 20) {
      return '#c8e6c9';
    }
    if (level <= 50) {
      return '#fff176';
    }
    if (level <= 100) {
      return '#ffb74d';
    }
    return '#ef9a9a';
  }

  @HostBinding('style.color')
  get textColor(): string {
    return this.appHighlightPollution > 100 ? '#7f0000' : '#263238';
  }

  @HostBinding('style.padding')
  readonly padding = '0.2rem 0.55rem';

  @HostBinding('style.borderRadius')
  readonly borderRadius = '0.25rem';
}
