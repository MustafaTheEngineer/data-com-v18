import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffManchesterComponent } from './diff-manchester.component';

describe('DiffManchesterComponent', () => {
  let component: DiffManchesterComponent;
  let fixture: ComponentFixture<DiffManchesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffManchesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffManchesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
