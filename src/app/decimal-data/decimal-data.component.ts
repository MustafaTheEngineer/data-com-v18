import { Component, input, output, signal } from '@angular/core';
import { InputDataDirective } from '../input-data.directive';

@Component({
  selector: 'app-decimal-data',
  standalone: true,
  imports: [InputDataDirective],
  templateUrl: './decimal-data.component.html',
  styleUrl: './decimal-data.component.scss',
})
export class DecimalDataComponent {
  warning = signal('');
  decimalData = output<number>();
  placeholder = input<string | undefined>(undefined);
  value = input<string>('');

  isDecimal(data: string) {
    if (Number.isInteger(Number(data))) {
      this.decimalData.emit(Number(data));
      this.warning.set('');
      return;
    }
    this.warning.set('Data is not decimal');
  }
}
