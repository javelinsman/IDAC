import { Injectable } from '@angular/core';
import { Chart } from './chart';
import { CHARTS } from './mock-charts';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getCharts(): Chart[] {
    return CHARTS
  }
}
