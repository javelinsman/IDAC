import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPanelComponent } from './master-panel.component';

describe('MasterPanelComponent', () => {
  let component: MasterPanelComponent;
  let fixture: ComponentFixture<MasterPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
