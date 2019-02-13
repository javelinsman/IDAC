import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeViewKeyHintComponent } from './chart-spec-tree-view-key-hint.component';

describe('ChartSpecTreeViewKeyHintComponent', () => {
  let component: ChartSpecTreeViewKeyHintComponent;
  let fixture: ComponentFixture<ChartSpecTreeViewKeyHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeViewKeyHintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeViewKeyHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
