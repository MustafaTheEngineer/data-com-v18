import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogSignalComponent } from './analog-signal.component';

describe('AnalogSignalComponent', () => {
  let component: AnalogSignalComponent;
  let fixture: ComponentFixture<AnalogSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalogSignalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalogSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
