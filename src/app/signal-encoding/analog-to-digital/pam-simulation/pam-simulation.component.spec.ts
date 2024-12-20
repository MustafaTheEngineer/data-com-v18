import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PamSimulationComponent } from './pam-simulation.component';

describe('PamSimulationComponent', () => {
  let component: PamSimulationComponent;
  let fixture: ComponentFixture<PamSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PamSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PamSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
