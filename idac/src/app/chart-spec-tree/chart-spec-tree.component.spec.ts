import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecTreeComponent } from './chart-spec-tree.component';

describe('ChartSpecTreeComponent', () => {
  let component: ChartSpecTreeComponent;
  let fixture: ComponentFixture<ChartSpecTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
