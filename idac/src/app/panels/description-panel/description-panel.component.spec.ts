import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionPanelComponent } from './description-panel.component';

describe('DescriptionPanelComponent', () => {
  let component: DescriptionPanelComponent;
  let fixture: ComponentFixture<DescriptionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
