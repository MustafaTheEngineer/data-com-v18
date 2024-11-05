import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrziComponent } from './nrzi.component';

describe('NrziComponent', () => {
  let component: NrziComponent;
  let fixture: ComponentFixture<NrziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NrziComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NrziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
