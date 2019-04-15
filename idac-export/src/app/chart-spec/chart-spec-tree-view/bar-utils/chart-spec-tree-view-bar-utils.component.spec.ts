import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeViewBarUtilsComponent } from './chart-spec-tree-view-bar-utils.component';

describe('ChartSpecTreeViewBarUtilsComponent', () => {
  let component: ChartSpecTreeViewBarUtilsComponent;
  let fixture: ComponentFixture<ChartSpecTreeViewBarUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeViewBarUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeViewBarUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
