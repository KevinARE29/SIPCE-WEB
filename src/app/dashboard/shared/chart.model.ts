import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

export class NgChart {
  data: number[];
  labels: Label[];
  type: ChartType;
  legend: boolean;
  options: ChartOptions;
  colors: string[];
}
