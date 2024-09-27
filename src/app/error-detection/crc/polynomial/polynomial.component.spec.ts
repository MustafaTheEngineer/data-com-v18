import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolynomialComponent } from './polynomial.component';

describe('PolynomialComponent', () => {
  let component: PolynomialComponent;
  let fixture: ComponentFixture<PolynomialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolynomialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolynomialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
