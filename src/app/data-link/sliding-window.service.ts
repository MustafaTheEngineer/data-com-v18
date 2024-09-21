import { Injectable } from '@angular/core';

export interface Frame {
  id: number;
  data: string;
  acknowledged: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SlidingWindowService {
  frames: Frame[] = [];

  constructor() {
	this.initializeFrames();
  }

  initializeFrames() {
    for (let i = 0; i < 100; i++) {
      this.frames.push({ id: i, data: `${i % 8}`, acknowledged: false });
    }
  }
}
