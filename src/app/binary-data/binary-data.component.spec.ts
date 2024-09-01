import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryDataComponent } from './binary-data.component';

describe('BinaryDataComponent', () => {
  let component: BinaryDataComponent;
  let fixture: ComponentFixture<BinaryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinaryDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
