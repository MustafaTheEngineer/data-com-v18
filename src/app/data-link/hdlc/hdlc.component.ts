import {
  Component,
  computed,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';

export type HdlcFrame = {
  id: number;
  data: string;
  acknowledged: boolean;
};

@Component({
  selector: 'app-hdlc',
  standalone: true,
  imports: [],
  templateUrl: './hdlc.component.html',
  styleUrl: './hdlc.component.scss',
})
export class HdlcComponent {
  senderLine = viewChild.required('senderLine', { read: ElementRef });
  deneme = viewChild.required('deneme', { read: ElementRef });
  svg = viewChild.required('svg', { read: ElementRef });
  lineNumber = computed(() => {
    const { top, bottom } =
      this.senderLine().nativeElement.getBoundingClientRect();
    const lineNumber = Math.floor((bottom - top) / 30);
    return [].constructor(lineNumber);
  });
  dashedLines = viewChildren('dashedLine', { read: ElementRef });
  setDashedLinePositions = computed(() => {
    this.dashedLines().forEach((line, index) => {
      line.nativeElement.y1.baseVal.value =
        this.senderLine().nativeElement.y1.baseVal.value + (index * 5);
      line.nativeElement.y2.baseVal.value =
        this.senderLine().nativeElement.y1.baseVal.value + (index * 5);
    });
    return
  });

  ngAfterViewInit() {
  }
}
