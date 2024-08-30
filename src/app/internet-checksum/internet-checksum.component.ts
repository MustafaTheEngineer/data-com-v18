import {
  Component,
  computed,
  ElementRef,
  Signal,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { HexDataComponent } from '../hex-data/hex-data.component';
import { InputDataDirective } from '../input-data.directive';
import anime from 'animejs';

type ChecksumData = {
  text: string;
  number1: string;
  number2: string;
  result: string;
};

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
  animationStep = 0;

  partialData = computed(() => {
    if (this.partial() < 2) return this.data();

    let result = '';
    for (let i = 0; i < this.data().length; i++) {
      result += this.data()[i];
      if ((i + 1) % this.partial() === 0) result += ' ';
    }

    return result;
  });

  senderProcess = computed(() => {
    let partialDataArray = this.partialData().split(' ');

    let sumView: ChecksumData[] = [
      {
        text: 'Sum partial data',
        number1: partialDataArray[0],
        number2: partialDataArray[1],
        result: (
          Number('0x' + partialDataArray[0]) +
          Number('0X' + partialDataArray[1])
        ).toString(16),
      },
    ];
    partialDataArray = partialDataArray.slice(2);

    const lastData = partialDataArray.pop();
    if (lastData && lastData.length === this.partial())
      partialDataArray.push(lastData);

    for (var i = 0; i < partialDataArray.length; i++) {
      Number('0x' + partialDataArray[i]) +
        Number('0X' + partialDataArray[i + 1]);
      sumView.push({
        text: 'Sum partial data',
        number1: sumView[sumView.length - 1].result,
        number2: partialDataArray[i],
        result: (
          Number('0x' + sumView[sumView.length - 1].result) +
          Number('0x' + partialDataArray[i])
        ).toString(16),
      });
      if (sumView[sumView.length - 1].result.length > this.partial()) {
        sumView.push({
          text: 'Carry',
          number1: sumView[sumView.length - 1].result.slice(1),
          number2: '1',
          result: (
            Number('0x' + sumView[sumView.length - 1].result.slice(1)) + 1
          ).toString(16),
        });
      }
    }

    sumView.push({
      text: "Result of 1's Complement of the result",
      number1: '',
      number2: '',
      result: Number(
        this.onesComplement(sumView[sumView.length - 1].result)
      ).toString(16),
    });

    return sumView;
  });

  receiverProcess = computed(() => {
    if (this.senderProcess().length) {
      return [
        ...this.senderProcess().slice(0, this.senderProcess().length - 1),
        {
          text: 'Sum partial data',
          number1: this.senderProcess()[this.senderProcess().length - 2].result,
          number2: this.senderProcess()[this.senderProcess().length - 1].result,
          result: (
            Number(
              '0x' +
                this.senderProcess()[this.senderProcess().length - 2].result
            ) +
            Number(
              '0x' +
                this.senderProcess()[this.senderProcess().length - 1].result
            )
          ).toString(16),
        },
      ];
    }

    return [];
  });

  animeDom = viewChildren<ElementRef>('anime');

  animations: Signal<anime.AnimeParams[]> = computed(() => {
    const result: anime.AnimeParams[] = [];

    for (let i = 0; i < this.animeDom().length; i++) {
      if (this.animeDom()[i].nativeElement.className === 'carry') {
        result.push({
          targets: this.animeDom()[i + 1].nativeElement,
          easing: 'easeInOutQuad',
          opacity: [0, 1],
          duration: 500,
        });

        result.push({
          targets: this.animeDom()[i].nativeElement,
          easing: 'easeOutElastic(1, .8)',
          duration: 2000,
          keyframes: [
            {
              translateY:
                this.animeDom()[i + 2].nativeElement.getBoundingClientRect().y -
                this.animeDom()[i].nativeElement.getBoundingClientRect().y,
            },
            {
              translateX:
                this.animeDom()[i + 2].nativeElement.getBoundingClientRect().x -
                this.animeDom()[i].nativeElement.getBoundingClientRect().x,
            },
          ],
        });

        i += 2;
      } else {
        result.push({
          targets: this.animeDom()[i].nativeElement,
          easing: 'easeInOutQuad',
          opacity: [0, 1],
          duration: 500,
        });
      }
    }

    return result;
  });
  animationsCompleted: anime.AnimeInstance[] = [];

  getPartial(partial: string) {
    if (Number.isInteger(Number(partial)) === false) return;

    this.partial.set(Number(partial));
  }

  onesComplement(hex: string) {
    // Parse the hex string to a number
    let num = parseInt(hex, 16);

    // Get the number of bits required to represent the number
    let numBits = hex.length * 4;

    // Create a mask with all bits set to 1 for the length of the number
    let mask = (1 << numBits) - 1;

    // Perform the one's complement by inverting the bits and masking the result
    let complement = ~num & mask;

    return complement;
  }

  nextProcess() {
    if (this.animationStep > this.animations().length - 1) {
      this.animationStep = 0;
      this.animationsCompleted.forEach((completed) => {
        completed.restart();
        completed.pause();
      });
      this.animationsCompleted = [];
      return;
    }
    const animeInstance = anime(this.animations()[this.animationStep]);
    this.animationsCompleted.push(animeInstance);

    ++this.animationStep;
  }

  previousProcess() {
	console.log(this.animationStep);
    if (this.animationStep === 0) {
      this.animations().forEach(() => {
        this.nextProcess();
      });
      return;
    }
    this.animationsCompleted[this.animationStep - 1].restart();
    this.animationsCompleted[this.animationStep - 1].pause();
    this.animationsCompleted.pop();

    --this.animationStep;
  }
}
