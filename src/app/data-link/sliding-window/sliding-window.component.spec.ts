import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingWindowComponent } from './sliding-window.component';

describe('SlidingWindowComponent', () => {
  let component: SlidingWindowComponent;
  let fixture: ComponentFixture<SlidingWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
