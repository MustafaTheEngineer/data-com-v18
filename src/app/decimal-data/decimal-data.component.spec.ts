import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimalDataComponent } from './decimal-data.component';

describe('DecimalDataComponent', () => {
  let component: DecimalDataComponent;
  let fixture: ComponentFixture<DecimalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecimalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecimalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
