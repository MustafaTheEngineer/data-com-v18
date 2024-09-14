import {
  Component,
  computed,
  ElementRef,
  Signal,
  signal,
  viewChildren,
  WritableSignal,
} from '@angular/core';
import { BinaryDataComponent } from '../binary-data/binary-data.component';
import { DecimalDataComponent } from '../decimal-data/decimal-data.component';
import anime, { remove } from 'animejs';

type DivOps = {
  dividendSteps: number[][];
  negativeSteps: number[][];
  quotient: number[];
  remainder: number[];
};

type AnimeSteps = {
  anime: anime.AnimeParams[];
  message: string;
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
  animationMessage = signal('');
  senderData = signal('');
  receiverData = signal('');

  dividerLength = signal(0);
  dividerPoly = signal<number[]>([]);
  dividerPolyView = computed(() => this.dividerPoly().sort((a, b) => b - a));
  dataPoly = computed(() => {
    const result: number[] = [];

    for (let i = 0; i < this.senderData().length; i++) {
      if (this.senderData()[i] === '1') {
        result.push(this.senderData().length - 1 - i);
      }
    }

    return result;
  });

  senderDividend = computed(() =>
    this.dataPoly().map((value) => value + this.dividerPolyView()[0])
  );

  receiverDividend = computed(() => [
    ...this.senderDividend(),
    ...this.senderDivisionOp().dividendSteps[
      this.senderDivisionOp().dividendSteps.length - 1
    ],
  ]);

  divisionOp(
    signalDividend: Signal<number[]>,
    signalDivider: WritableSignal<number[]>
  ) {
    const dividend = [...signalDividend()];
    const divider = [...signalDivider()];
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
    } as DivOps;
  }

  senderDivisionOp = computed(() =>
    this.divisionOp(this.senderDividend, this.dividerPoly)
  );

  receiverDivisionOp = computed(() =>
    this.divisionOp(this.receiverDividend, this.dividerPoly)
  );

  senderAnime = viewChildren<ElementRef>('senderAnime');
  receiverAnime = viewChildren<ElementRef>('receiverAnime');

  calcAnimation(
    animeDom: Signal<readonly ElementRef<any>[]>,
    signalDivOps: Signal<DivOps>
  ) {
    const result: AnimeSteps[] = [];
    const nodes = animeDom().map((node) => node.nativeElement);
    const divider =
      nodes[nodes.findIndex((node) => node.className === 'divider')];
    const quotient =
      nodes[nodes.findIndex((node) => node.className === 'quotient')];
    let quotientIndex = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (
        nodes[i].className === 'dividend-step-container' &&
        nodes[i + 1].className !== 'negative-step'
      ) {
        result.push({
          anime: [
            {
              targets: nodes[i],
              opacity: [0, 1],
              easing: 'easeOutExpo',
            },
          ],
          message: 'Result',
        });
        ++i;
        continue;
      }

      if (nodes[i].className === 'dividend-step-container') {
        result.push({
          anime: [
            {
              targets: nodes[i],
              opacity: [0, 1],
              easing: 'easeOutExpo',
            },
            {
              targets: nodes[i].children[0],
              backgroundColor: '#0047AB',
              easing: 'easeOutExpo',
            },
            {
              targets: divider.children[0],
              backgroundColor: '#0047AB',
              easing: 'easeOutExpo',
            },
          ],
          message:
            'Subtract the biggest number of the divider from the biggest number of the dividend.',
        });

        result.push({
          anime: [
            {
              targets: nodes[i].children[0],
              backgroundColor: '#000000',
              easing: 'easeOutExpo',
            },
            {
              targets: divider.children[0],
              backgroundColor: '#000000',
              easing: 'easeOutExpo',
            },
            {
              targets: quotient.children[quotientIndex],
              opacity: [0, 1],
              backgroundColor: '#0047AB',
              delay: 100,
              easing: 'easeOutExpo',
            },
          ],
          message: 'Multilpy the result with divider numbers.',
        });
      }

      if (nodes[i + 1] && nodes[i + 1].className === 'negative-step') {
        result.push({
          anime: [
            {
              targets: divider.children,
              backgroundColor: '#0047AB',
              delay: anime.stagger(750),
              easing: 'easeOutExpo',
              complete: function (anim) {
                anim.restart();
                anim.pause();
              },
            },
            {
              targets: nodes[i + 1].children,
              opacity: [0, 1],
              delay: anime.stagger(750),
              easing: 'easeOutExpo',
            },
          ],
          message: 'Multilpy the result with divider numbers.',
        });

        const removeArray: anime.AnimeParams[] = [
          {
            targets: quotient.children[quotientIndex],
            backgroundColor: '#000000',
            delay: 100,
            easing: 'easeOutExpo',
          },
          {
            targets: divider.children,
            backgroundColor: '#000000',
            easing: 'easeOutExpo',
          },
        ];

        for (const negative of signalDivOps().negativeSteps[quotientIndex]) {
          const subtractIndex =
            signalDivOps().dividendSteps[quotientIndex].indexOf(negative);

          if (subtractIndex !== -1) {
            removeArray.push({
              targets: nodes[i].children[subtractIndex],
              backgroundColor: '#ff0000',
              easing: 'easeOutExpo',
            });

            removeArray.push({
              targets:
                nodes[i + 1].children[
                  signalDivOps().negativeSteps[quotientIndex].indexOf(negative)
                ],
              backgroundColor: '#ff0000',
              easing: 'easeOutExpo',
            });
          }
        }

        result.push({anime: removeArray, message: 'If there are common numbers in dividend part, remove them. Add otherwise.'});

        ++quotientIndex;
      }
    }

    return result ;
  }

  animations = computed(() => {
    const senderAnimations = this.calcAnimation(
      this.senderAnime,
      this.senderDivisionOp
    );
    const receiverAnimations = this.calcAnimation(
      this.receiverAnime,
      this.receiverDivisionOp
    );
    return [...senderAnimations, ...receiverAnimations];
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
    if (this.animationStep > this.animations().length - 1) {
      this.animationStep = 0;
    }

    this.animations()[this.animationStep].anime.forEach((value) => {
      anime(value);
    });

    this.animationMessage.set(this.animations()[this.animationStep].message);

    ++this.animationStep;
  }
}
