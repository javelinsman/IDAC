import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardPanelComponent } from './keyboard-panel.component';

describe('KeyboardPanelComponent', () => {
  let component: KeyboardPanelComponent;
  let fixture: ComponentFixture<KeyboardPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
