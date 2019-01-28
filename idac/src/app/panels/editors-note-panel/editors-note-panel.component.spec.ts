import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsNotePanelComponent } from './editors-note-panel.component';

describe('EditorsNotePanelComponent', () => {
  let component: EditorsNotePanelComponent;
  let fixture: ComponentFixture<EditorsNotePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorsNotePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorsNotePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
