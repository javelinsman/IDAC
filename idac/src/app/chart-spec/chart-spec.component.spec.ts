import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSpecComponent } from './chart-spec.component';

describe('ChartSpecComponent', () => {
  let component: ChartSpecComponent;
  let fixture: ComponentFixture<ChartSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
