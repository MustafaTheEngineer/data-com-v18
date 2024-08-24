import { Component, signal } from '@angular/core';
import { InputDataDirective } from '../input-data.directive';

@Component({
  selector: 'app-hex-data',
  standalone: true,
  imports: [InputDataDirective],
  templateUrl: './hex-data.component.html',
  styleUrl: './hex-data.component.scss',
})
export class HexDataComponent {
	hexData = signal('');

  isHex(input: String) {
	if (!input.length) {
		this.hexData.set('');
		return;
	}
	if (Number.isNaN(Number('0x' + input))) {
		console.log('Not Hex');
		return;
	  }
  }
}
