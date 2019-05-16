import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchCanvasComponent } from './touch-canvas.component';

describe('TouchCanvasComponent', () => {
  let component: TouchCanvasComponent;
  let fixture: ComponentFixture<TouchCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouchCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
