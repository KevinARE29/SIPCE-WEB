import { Component, OnInit } from '@angular/core';
import { SchoolYearService } from '../../shared/school-year.service';

@Component({
  selector: 'app-school-year-end-summary',
  templateUrl: './school-year-end-summary.component.html',
  styleUrls: ['./school-year-end-summary.component.css']
})
export class SchoolYearEndSummaryComponent implements OnInit {
  constructor(private schoolYearService: SchoolYearService) {}

  ngOnInit(): void {
    console.log('Init end year');
    this.getData();
  }

  getData(): void {
    this.schoolYearService.getClosingStatus().subscribe((data) => {
      console.log(data);
    });
  }
}
