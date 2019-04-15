import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeViewDescriptionComponent } from './chart-spec-tree-view-description.component';

describe('ChartSpecTreeViewDescriptionComponent', () => {
  let component: ChartSpecTreeViewDescriptionComponent;
  let fixture: ComponentFixture<ChartSpecTreeViewDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeViewDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeViewDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
