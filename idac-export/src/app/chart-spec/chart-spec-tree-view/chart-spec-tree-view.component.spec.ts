import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeViewComponent } from './chart-spec-tree-view.component';

describe('ChartSpecTreeViewComponent', () => {
  let component: ChartSpecTreeViewComponent;
  let fixture: ComponentFixture<ChartSpecTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
