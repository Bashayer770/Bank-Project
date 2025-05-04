import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLinkComponent } from './transfer-link.component';

describe('TransferLinkComponent', () => {
  let component: TransferLinkComponent;
  let fixture: ComponentFixture<TransferLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
