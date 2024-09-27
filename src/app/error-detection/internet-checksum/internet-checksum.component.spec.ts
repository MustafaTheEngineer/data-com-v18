import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetChecksumComponent } from './internet-checksum.component';

describe('InternetChecksumComponent', () => {
  let component: InternetChecksumComponent;
  let fixture: ComponentFixture<InternetChecksumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternetChecksumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternetChecksumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
