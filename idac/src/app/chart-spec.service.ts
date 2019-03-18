import { Injectable } from '@angular/core';
import { ChartSpec } from './chart-structure/chart-spec/chart-spec';
import { SpecTag } from './chart-structure/chart-spec/spec-tag';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartSpecService {

  private _chartSpec: BehaviorSubject<ChartSpec> = new BehaviorSubject(null);
  private _currentTag: BehaviorSubject<SpecTag> = new BehaviorSubject(null);

  constructor() { }

  get chartSpec() { return this._chartSpec.getValue(); }
  set chartSpec(chartSpec) { this._chartSpec.next(chartSpec); }
  get chartSpecObservable() { return this._chartSpec.asObservable(); }

  get currentTag() { return this._currentTag.getValue(); }
  set currentTag(currentTag) { this._currentTag.next(currentTag); }
  get currentTagObservable() { return this._currentTag.asObservable(); }

  bindChartSpec(component, currentTagName= 'currentTag', chartSpecName= 'chartSpec') {
    component.chartSpecService.currentTagObservable.subscribe(currentTag => {
      component[currentTagName] = currentTag;
    });
    component.chartSpecService.chartSpecObservable.subscribe(chartSpec => {
      component[chartSpecName] = chartSpec;
    });
  }

}
