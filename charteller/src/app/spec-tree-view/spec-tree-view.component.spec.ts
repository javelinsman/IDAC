import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecTreeViewComponent } from './spec-tree-view.component';

describe('SpecTreeViewComponent', () => {
  let component: SpecTreeViewComponent;
  let fixture: ComponentFixture<SpecTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
