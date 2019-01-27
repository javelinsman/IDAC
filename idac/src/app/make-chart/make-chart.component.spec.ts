import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeChartComponent } from './make-chart.component';

describe('MakeChartComponent', () => {
  let component: MakeChartComponent;
  let fixture: ComponentFixture<MakeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
