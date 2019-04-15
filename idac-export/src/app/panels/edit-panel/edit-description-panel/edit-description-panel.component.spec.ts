import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDescriptionPanelComponent } from './edit-description-panel.component';

describe('EditDescriptionPanelComponent', () => {
  let component: EditDescriptionPanelComponent;
  let fixture: ComponentFixture<EditDescriptionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDescriptionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDescriptionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
