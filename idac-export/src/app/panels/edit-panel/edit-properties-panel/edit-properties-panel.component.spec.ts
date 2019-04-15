import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertiesPanelComponent } from './edit-properties-panel.component';

describe('EditPropertiesPanelComponent', () => {
  let component: EditPropertiesPanelComponent;
  let fixture: ComponentFixture<EditPropertiesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPropertiesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPropertiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
