import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeViewTagnameComponent } from './chart-spec-tree-view-tagname.component';

describe('ChartSpecTreeViewTagnameComponent', () => {
  let component: ChartSpecTreeViewTagnameComponent;
  let fixture: ComponentFixture<ChartSpecTreeViewTagnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeViewTagnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeViewTagnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
