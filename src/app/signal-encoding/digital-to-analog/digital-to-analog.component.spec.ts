import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalToAnalogComponent } from './digital-to-analog.component';

describe('DigitalToAnalogComponent', () => {
  let component: DigitalToAnalogComponent;
  let fixture: ComponentFixture<DigitalToAnalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalToAnalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalToAnalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
