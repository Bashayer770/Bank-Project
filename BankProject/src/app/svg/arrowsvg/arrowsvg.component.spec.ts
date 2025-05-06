import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowsvgComponent } from './arrowsvg.component';

describe('ArrowsvgComponent', () => {
  let component: ArrowsvgComponent;
  let fixture: ComponentFixture<ArrowsvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowsvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowsvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
