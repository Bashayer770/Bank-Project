import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTransferBoldComponent } from './card-transfer-bold.component';

describe('CardTransferBoldComponent', () => {
  let component: CardTransferBoldComponent;
  let fixture: ComponentFixture<CardTransferBoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTransferBoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTransferBoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
