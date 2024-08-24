import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexDataComponent } from './hex-data.component';

describe('HexDataComponent', () => {
  let component: HexDataComponent;
  let fixture: ComponentFixture<HexDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
