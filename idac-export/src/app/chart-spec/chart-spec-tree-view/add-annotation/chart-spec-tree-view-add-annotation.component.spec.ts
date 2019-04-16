import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeViewAddAnnotationComponent } from './chart-spec-tree-view-add-annotation.component';

describe('ChartSpecTreeViewAddAnnotationComponent', () => {
  let component: ChartSpecTreeViewAddAnnotationComponent;
  let fixture: ComponentFixture<ChartSpecTreeViewAddAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeViewAddAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeViewAddAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
