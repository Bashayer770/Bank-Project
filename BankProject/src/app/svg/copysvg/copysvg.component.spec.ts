import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopysvgComponent } from './copysvg.component';

describe('CopysvgComponent', () => {
  let component: CopysvgComponent;
  let fixture: ComponentFixture<CopysvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopysvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopysvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
