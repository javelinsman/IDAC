import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesPanelPopupComponent } from './properties-panel-popup.component';

describe('PropertiesPanelPopupComponent', () => {
  let component: PropertiesPanelPopupComponent;
  let fixture: ComponentFixture<PropertiesPanelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesPanelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesPanelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
