import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

export class NgChart {
  data: number[];
  datasets: ChartDataSets[];
  labels: Label[];
  type: ChartType;
  legend: boolean;
  options: ChartOptions;
  colors: string[];
}
