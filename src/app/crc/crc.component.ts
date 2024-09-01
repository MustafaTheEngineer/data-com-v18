import {
  Component,
  computed,
  ElementRef,
  signal,
  viewChildren,
  WritableSignal,
} from '@angular/core';
import { BinaryDataComponent } from '../binary-data/binary-data.component';
import { DecimalDataComponent } from '../decimal-data/decimal-data.component';
import anime from 'animejs';

type DivOps = {
  dividendSteps: number[][];
  negativeSteps: number[][];
  quotient: number[];
  remainder: number[];
};

type DataTransaction = {
  data: string;
  crc: string;
};

@Component({
  selector: 'app-crc',
  standalone: true,
  imports: [BinaryDataComponent, DecimalDataComponent],
  templateUrl: './crc.component.html',
  styleUrl: './crc.component.scss',
})
export class CrcComponent {
  animationStep = 0;
  senderData = signal('');
  receiverData = signal('');

  dividerLength = signal(0);
  dividerPoly = signal<number[]>([]);
  dividerPolyView = computed(() =>
    [...this.dividerPoly()].sort((a, b) => b - a)
  );
  dataPoly = computed(() => {
    const result: number[] = [];

    for (let i = 0; i < this.senderData().length; i++) {
      if (this.senderData()[i] === '1') {
        result.push(this.senderData().length - 1 - i);
      }
    }

    return result;
  });

  dividend = computed(() =>
    this.dataPoly().map((value) => value + this.dividerPolyView()[0])
  );

  division = computed(() => {
    const dividend = [...this.dividend()];
    const divider = [...this.dividerPoly()];
    const dividendSteps: number[][] = [dividend];
    const negativeSteps: number[][] = [];
    const quotient = [];

    let stepIndex = 0;

    while (dividendSteps[stepIndex][0] >= divider[0]) {
      quotient.push(dividendSteps[stepIndex][0] - divider[0]);
      var negativeStep: number[] = [];
      var dividendStep: number[] = [...dividendSteps[stepIndex]];

      for (let i = 0; i < divider.length; i++) {
        negativeStep.push(divider[i] + quotient[stepIndex]);
      }

      negativeStep.forEach((item) => {
        const found = dividendStep.indexOf(item);
        if (found != -1) dividendStep.splice(found, 1);
        else dividendStep.push(item);
      });

      dividendStep.sort((a, b) => b - a);

      dividendSteps.push(dividendStep);
      negativeSteps.push(negativeStep);

      stepIndex++;
    }

    const remainder = dividendSteps[dividendSteps.length - 1];

    return {
      quotient,
      dividendSteps,
      negativeSteps,
      remainder,
    } satisfies DivOps;
  });

  anime = viewChildren<ElementRef>('anime');
  animations = computed(() => {
    const result: anime.AnimeParams[][] = [];
    const quotientNodes = this.anime().filter(
      (el) => el.nativeElement.className === 'quotient'
    )[0].nativeElement.children;
    const dividendSteps = this.anime().filter(
      (el) => el.nativeElement.className === 'dividend-step-container'
    );

    result.push([
      {
        targets: dividendSteps[0].nativeElement.children[0],
        backgroundColor: '#0047AB',
		duration: 1000,
		easing: 'easeOutExpo'
      },
    ]);

    console.log(result);

    return result;
  });

  setData(data: string) {
    this.senderData.set(data);
    this.receiverData.set(data);
  }

  setDivider(length: number) {
    this.dividerLength.set(length);

    const dividerPoly = [];
    for (let i = 0; i < length; i++) {
      dividerPoly.push(i);
    }

    this.dividerPoly.set(dividerPoly.reverse());
  }

  setDividerPoly(newValue: number, index: number) {
    const result = [...this.dividerPoly()];
    result[index] = newValue;
    this.dividerPoly.set(result);
  }

  toggleSender(index: number) {
    this.senderData.update((value) => this.toggleData(value, index));
    this.receiverData.set(this.senderData());
  }

  toggleReceiver(index: number) {
    this.receiverData.update((value) => this.toggleData(value, index));
  }

  toggleData(value: string, index: number) {
    return (
      value.substring(0, index) +
      (value[index] === '0' ? '1' : '0') +
      value.substring(index + 1)
    );
  }

  nextStep() {
    this.animations()[this.animationStep].forEach((value) => {
      anime(value);
    });

    ++this.animationStep;
  }
}
