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
  propagationTime = 4;
	frames: HdlcFrame[] = [
		{ id: 1, data: 'A', acknowledged: false },
		{ id: 2, data: 'B', acknowledged: false },
		{ id: 3, data: 'C', acknowledged: false },
		{ id: 4, data: 'D', acknowledged: false },
		{ id: 5, data: 'E', acknowledged: false },
		{ id: 6, data: 'F', acknowledged: false },
		{ id: 7, data: 'G', acknowledged: false },
		{ id: 8, data: 'H', acknowledged: false },
		{ id: 9, data: 'I', acknowledged: false },
	];

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
