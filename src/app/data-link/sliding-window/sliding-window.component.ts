import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { Frame, SlidingWindowService } from '../sliding-window.service';

@Component({
  selector: 'app-sliding-window',
  standalone: true,
  imports: [],
  templateUrl: './sliding-window.component.html',
  styleUrl: './sliding-window.component.scss',
})
export class SlidingWindowComponent {
  slidingWindowService = inject(SlidingWindowService);
  frames = this.slidingWindowService.frames;
  window = signal<{ start: Frame; end: Frame }>({
    start: { id: 0, data: '0', acknowledged: false },
    end: { id: 7, data: '7', acknowledged: false },
  });
  framesDom = viewChildren('frame', { read: ElementRef });
  frameWidth = computed(() => {
    console.log(this.framesDom()[0]?.nativeElement.offsetWidth);
    return this.framesDom()[0]?.nativeElement.offsetWidth;
  });
  slidingWindowLength = computed(
    () => (this.window().end.id - this.window().start.id) * this.frameWidth()
  );
  slidingWindowPosition = computed(
    () => this.window().start.id * this.frameWidth()
  );
  rr = signal(0);
  bufferLinePosition = computed(() => this.rr() * 31.6);

  ngOnInit() {
    //console.log(this.frames);
  }

  sendData() {
    if (this.window().start.id < this.frames.length) {
      this.window.update((value) => ({
        start: this.frames[value.start.id + 1],
        end: value.end,
      }));
    }
  }

  acknowledge(frameId: string) {
    const id = Number(frameId);
    if (id < this.rr()) return;

    for (const frame of this.frames) {
      if (frame.id > id) {
        this.rr.set(frame.id);
        break;
      }
      frame.acknowledged = true;
    }
  }
}
