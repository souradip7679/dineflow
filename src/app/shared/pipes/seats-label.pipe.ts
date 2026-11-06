import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seatsLabel',
  standalone: true
})
export class SeatsLabelPipe implements PipeTransform {
  transform(count: number | string): string {
    const num = Number(count);
    if (isNaN(num)) return `${count} Guests`;
    if (num === 1) return '1 Guest';
    return `${num} Guests`;
  }
}
