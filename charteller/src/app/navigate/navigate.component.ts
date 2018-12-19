import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_accent_json';
import { ChartInfo } from '../chart_info';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  chart: Chart;
  info: ChartInfo;
  
  constructor(
    private route: ActivatedRoute,
    private chartService: ChartService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getChart();
  }

  getChart(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.chart = this.chartService.getCharts().find(d => +d.id == +id);
    this.http.get(this.chart.src_json)
      .subscribe((chartAccent: ChartAccent.ChartAccentJSON) => {
        console.log(chartAccent);
        this.info = this.convert(chartAccent);
        console.log(this.info);
        console.log(Object.entries(this.info))
      });
  }

  convert(ca: ChartAccent.ChartAccentJSON): ChartInfo {
    return {
      title: ca.chart.title.text,
      y: {
        min: ca.chart.yScale.min,
        max: ca.chart.yScale.max,
        label: ca.chart.yLabel.text.split('(')[0].trim(),
        unit: ca.chart.yLabel.text.split('(')
          .slice(1).join('(').slice(0,-1).split(':').slice(1).join(':').trim()
      },
      x: {
        ticks: ca.dataset.rows.map(row => ({tick: row[ca.dataset.columns[0].name]}))
      },
      legend: {
        items: ca.chart.yColumns
      },
      marks: {
        bargroups: ca.dataset.rows.map(row => {
          return {
            name: row[ca.dataset.columns[0].name],
            bars: ca.dataset.columns.slice(1).map(column => column.name)
              .map(key => ({key: key, value: row[key]}))
          }
        })
      },
      annotations: {
        annotations: ca.annotations.annotations.map((annotation, i) => {
          return {
            id: i,
            type: annotation.target.type
          };
        })
      }
    }
  }
}
