import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgContainerComponent } from './svg-container.component';

describe('SvgContainerComponent', () => {
  let component: SvgContainerComponent;
  let fixture: ComponentFixture<SvgContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
