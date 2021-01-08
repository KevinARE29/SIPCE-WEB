import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../../shared/dashboard.service';
import { NgChart } from './../../shared/chart.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  activeUsers: string;
  totalStudents: string;
  usersByRole: NgChart;
  studentsByStatus: NgChart;
  studentsByShiftAndGrade: NgChart;
  studentsByShift: NgChart;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDashboard();
  }

  getDashboard(): void {
    this.loading = true;
    this.dashboardService.getDashboard().subscribe((data) => {
      this.activeUsers = data['activeUsers'];
      this.totalStudents = data['totalStudents'];
      this.usersByRole = data['usersByRole'];
      this.studentsByStatus = data['studentsByStatus'];
      this.studentsByShift = data['studentsByShift'];
      this.studentsByShiftAndGrade = data['studentsByShiftAndGrade'];

      this.loading = false;
    });
  }
}
