import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdlcComponent } from './hdlc.component';

describe('HdlcComponent', () => {
  let component: HdlcComponent;
  let fixture: ComponentFixture<HdlcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HdlcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HdlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
