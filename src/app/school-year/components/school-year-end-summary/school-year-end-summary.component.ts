import { Component, OnInit } from '@angular/core';
import { SchoolYearService } from '../../shared/school-year.service';

interface Section {
  id: number;
  name: string;
  teacher: string;
  closed: boolean;
}

interface Grade {
  id: number;
  name: string;
  expand: boolean;
  gradePercentage: number;
  sections: Section[];
}

interface Shift {
  id: number;
  name: string;
  shiftPercentage: number;
  grades: Grade[];
}

@Component({
  selector: 'app-school-year-end-summary',
  templateUrl: './school-year-end-summary.component.html',
  styleUrls: ['./school-year-end-summary.component.css']
})
export class SchoolYearEndSummaryComponent implements OnInit {
  data: unknown;
  shifts: Shift[] = [];
  expandSet = new Set<number>();

  constructor(private schoolYearService: SchoolYearService) {}

  ngOnInit(): void {
    console.log('Init end year');
    this.getData();
  }

  getData(): void {
    this.schoolYearService.getClosingStatus().subscribe((data) => {
      this.data = data;
      this.shifts = data['shifts'];
      console.log(this.data, this.shifts);
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
