import { TestBed } from '@angular/core/testing';

import { BiphaseService } from './biphase.service';

describe('BiphaseService', () => {
  let service: BiphaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiphaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
