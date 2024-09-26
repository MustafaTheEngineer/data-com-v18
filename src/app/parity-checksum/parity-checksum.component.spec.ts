import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParityChecksumComponent } from './parity-checksum.component';

describe('ParityChecksumComponent', () => {
  let component: ParityChecksumComponent;
  let fixture: ComponentFixture<ParityChecksumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParityChecksumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParityChecksumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
