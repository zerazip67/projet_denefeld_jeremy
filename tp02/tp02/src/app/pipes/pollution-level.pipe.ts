import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pollutionLevel',
  standalone: true,
})
export class PollutionLevelPipe implements PipeTransform {
  transform(level: number): string {
    if (level <= 20) {
      return 'Faible';
    }
    if (level <= 50) {
      return 'Modérée';
    }
    if (level <= 100) {
      return 'Élevée';
    }
    return 'Dangereuse';
  }
}
