import { Component, inject, model, output, signal } from '@angular/core';
import { InputDataDirective } from '../input-data.directive';

@Component({
  selector: 'app-hex-data',
  standalone: true,
  imports: [InputDataDirective],
  templateUrl: './hex-data.component.html',
  styleUrl: './hex-data.component.scss',
})
export class HexDataComponent {
  hexData = model<string>('');
  warning = '';

  isHex(input: string) {
    if (!input.length) {
      this.hexData.set('');
	  this.warning = '';
      return;
    }
    if (Number.isNaN(Number('0x' + input))) {
      this.warning = 'Value is not hexadecimal';
    } else {
      this.warning = '';
	  this.hexData.set(input)
    }
  }

}
