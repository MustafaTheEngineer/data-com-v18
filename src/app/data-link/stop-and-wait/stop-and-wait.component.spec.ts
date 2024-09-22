import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopAndWaitComponent } from './stop-and-wait.component';

describe('StopAndWaitComponent', () => {
  let component: StopAndWaitComponent;
  let fixture: ComponentFixture<StopAndWaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopAndWaitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopAndWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
