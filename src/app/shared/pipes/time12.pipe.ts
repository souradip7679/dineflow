import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time12',
  standalone: true
})
export class Time12Pipe implements PipeTransform {
  transform(time24?: string): string {
    if (!time24) return '';
    const parts = time24.split(':');
    if (parts.length < 2) return time24;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
  }
}
