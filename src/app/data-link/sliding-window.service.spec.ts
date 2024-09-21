import { TestBed } from '@angular/core/testing';

import { SlidingWindowService } from './sliding-window.service';

describe('SlidingWindowService', () => {
  let service: SlidingWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidingWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
