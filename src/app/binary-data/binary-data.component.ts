import { Component, input, output, signal } from '@angular/core';
import { InputDataDirective } from '../input-data.directive';

@Component({
  selector: 'app-binary-data',
  standalone: true,
  imports: [InputDataDirective],
  templateUrl: './binary-data.component.html',
  styleUrl: './binary-data.component.scss',
})
export class BinaryDataComponent {
  binaryData = output<string>();
  warning = signal('');
  placeholder = input<string | undefined>(undefined);

  isBinary(data: string) {
    for (const char of data) {
      if ('01'.includes(char) === false) {
		this.binaryData.emit('');
        this.warning.set('Data is not binary');
        return;
      }
    }
    this.warning.set('');
    this.binaryData.emit(data);
  }
}
