import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandHoldingDollarComponent } from './hand-holding-dollar.component';

describe('HandHoldingDollarComponent', () => {
  let component: HandHoldingDollarComponent;
  let fixture: ComponentFixture<HandHoldingDollarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandHoldingDollarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandHoldingDollarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
