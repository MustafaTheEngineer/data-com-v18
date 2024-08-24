import { Component, computed, signal } from '@angular/core';
import { HexDataComponent } from '../hex-data/hex-data.component';
import { InputDataDirective } from '../input-data.directive';

@Component({
  selector: 'app-internet-checksum',
  standalone: true,
  imports: [HexDataComponent, InputDataDirective],
  templateUrl: './internet-checksum.component.html',
  styleUrl: './internet-checksum.component.scss',
})
export class InternetChecksumComponent {
  partial = signal(4);
  data = signal('');
  partialData = computed(() => {
    if (this.partial() < 2) return this.data();

    let result = '';
    for (let i = 0; i < this.data().length; i++) {
      result += this.data()[i];
      if ((i + 1) % this.partial() === 0) result += ' ';
    }

    console.log(this.data());

    return result;
  });

  getPartial(partial: string) {
    if (Number.isInteger(Number(partial)) === false) return;

    this.partial.set(Number(partial));
  }
}
