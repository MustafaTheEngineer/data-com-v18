import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogVisualComponent } from './analog-visual.component';

describe('AnalogVisualComponent', () => {
  let component: AnalogVisualComponent;
  let fixture: ComponentFixture<AnalogVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalogVisualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalogVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
