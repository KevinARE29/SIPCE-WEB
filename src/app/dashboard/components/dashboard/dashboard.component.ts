import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  //#region Line chart with ng2-charts
  // TODO: Update code based on use case
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', fill: false, lineTension: 0 },
    { data: [75, 89, 90, 51, 26, 85, 20], label: 'Series B', fill: false, lineTension: 0 },
    { data: [25, 49, 60, 71, 86, 25, 90], label: 'Series C', fill: false, lineTension: 0 }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // public lineChartOptions: ChartOptions & { annotation: any } = {
  //   responsive: true
  // };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgba(255,0,0,0.3)'//,
      //backgroundColor: 'rgba(255,0,0,0.3)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  //#endregion

  //#region Chart with highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        type: 'line'
      },
      {
        data: [75, 89, 90, 51, 26, 85, 20],
        type: 'line'
      }
    ],
    credits: {
      enabled: false
    }
  };
  //#endregion

  constructor() {}

  ngOnInit(): void {}
}
