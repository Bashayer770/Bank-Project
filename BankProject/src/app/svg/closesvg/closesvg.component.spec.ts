import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosesvgComponent } from './closesvg.component';

describe('ClosesvgComponent', () => {
  let component: ClosesvgComponent;
  let fixture: ComponentFixture<ClosesvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosesvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosesvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
