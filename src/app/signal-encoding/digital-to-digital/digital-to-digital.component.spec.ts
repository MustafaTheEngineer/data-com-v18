import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalToDigitalComponent } from './digital-to-digital.component';

describe('DigitalToDigitalComponent', () => {
  let component: DigitalToDigitalComponent;
  let fixture: ComponentFixture<DigitalToDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalToDigitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalToDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
