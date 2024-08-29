import {
  Component,
  computed,
  ElementRef,
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
  animationStep = signal(0);

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
  senderProcessView = computed(() =>
    this.senderProcess().slice(0, this.animationStep())
  );
  senderProcessDom = viewChildren<ElementRef>('senderProcess');
  carry = viewChildren<ElementRef>('carry');
  addCarry = viewChildren<ElementRef>('addCarry');
  carryProcess = computed(() => {});

  domAnimation = computed(() => {
    if (this.senderProcessDom().length == 1) {
      anime({
        targets: '#sender-title',
        easing: 'easeInOutQuad',
        opacity: [0, 1],
        duration: 500,
      });
    }

    if (this.senderProcessDom().length) {
      anime({
        targets:
          this.senderProcessDom()[this.senderProcessDom().length - 1]
            .nativeElement,
        easing: 'easeInOutQuad',
        opacity: [0, 1],
        duration: 500,
      });
    }
  });

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
    if (this.animationStep() > this.senderProcess().length - 1) {
      this.animationStep.set(0);
    }

    if (!this.animationStep()) {
      this.animationStep.update((value) => ++value);
      return;
    }

    if (this.senderProcessView()[this.animationStep() - 1].text === 'Carry') {
      if (this.addCarry().length) {
        anime({
          targets: this.carry()[this.carry().length - 1].nativeElement,
          easing: 'easeOutElastic(1, .8)',
          duration: 2000,
          keyframes: [
            {
              translateY:
                this.addCarry()[
                  this.addCarry().length - 1
                ].nativeElement.getBoundingClientRect().y -
                this.carry()[
                  this.carry().length - 1
                ].nativeElement.getBoundingClientRect().y,
            },
            {
              translateX:
                this.addCarry()[
                  this.addCarry().length - 1
                ].nativeElement.getBoundingClientRect().x -
                this.carry()[
                  this.carry().length - 1
                ].nativeElement.getBoundingClientRect().x,
            },
          ],
          begin: () => {
            this.animationStep.update((value) => ++value);
          },
        });
      }
    } else {
      this.animationStep.update((value) => ++value);
    }
  }

  previousProcess() {
    if (this.animationStep() < 0) {
      this.animationStep.set(this.senderProcess().length - 1);
    }

    this.animationStep.update((value) => --value);
  }
}
