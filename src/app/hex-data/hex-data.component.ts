import { Component, inject, output, signal } from '@angular/core';
import { InputDataDirective } from '../input-data.directive';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-hex-data',
  standalone: true,
  imports: [InputDataDirective],
  templateUrl: './hex-data.component.html',
  styleUrl: './hex-data.component.scss',
})
export class HexDataComponent {
  messageService = inject(MessageService);
  hexData = output<string>();
  warning = signal('');

  isHex(input: string) {
    if (!input.length) {
      this.hexData.emit('');
	  this.warning.set('');
      return;
    }
    if (Number.isNaN(Number('0x' + input))) {
      this.warning.set('Value is not hexadecimal');
	  if (!this.warning().length) {
	  }
    } else {
      this.warning.set('');
	  this.hexData.emit(input)
    }
  }

}
