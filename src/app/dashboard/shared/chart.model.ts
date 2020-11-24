import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

export class NgChart {
  data: number[];
  datasets: ChartDataSets[];
  labels: Label[];
  type: ChartType;
  legend: boolean;
  options: ChartOptions;
  colors: Color[];
}
