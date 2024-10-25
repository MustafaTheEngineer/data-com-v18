import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrzComponent } from './nrz.component';

describe('NrzComponent', () => {
  let component: NrzComponent;
  let fixture: ComponentFixture<NrzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NrzComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NrzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
