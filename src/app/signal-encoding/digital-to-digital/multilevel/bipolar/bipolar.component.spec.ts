import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BipolarComponent } from './bipolar.component';

describe('BipolarComponent', () => {
  let component: BipolarComponent;
  let fixture: ComponentFixture<BipolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BipolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BipolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
