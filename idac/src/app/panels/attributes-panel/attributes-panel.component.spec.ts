import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesPanelComponent } from './attributes-panel.component';

describe('AttributesPanelComponent', () => {
  let component: AttributesPanelComponent;
  let fixture: ComponentFixture<AttributesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
