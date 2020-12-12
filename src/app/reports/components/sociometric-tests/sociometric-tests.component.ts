import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { NgChart } from 'src/app/dashboard/shared/chart.model';

import { SchoolYearService } from 'src/app/school-year/shared/school-year.service';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { StudentService } from 'src/app/students/shared/student.service';
import { Student } from 'src/app/students/shared/student.model';
import { ReportService } from '../../shared/report.service';
import { SociometricReport } from '../../shared/sociometric-report.model';

class ShiftGradeSection {
  id: number;
  name: string;
  children?: ShiftGradeSection[];
}

@Component({
  selector: 'app-sociometric-tests',
  templateUrl: './sociometric-tests.component.html',
  styleUrls: ['./sociometric-tests.component.css']
})
export class SociometricTestsComponent implements OnInit {
  loading = false;
  results: Student[];

  // Search params
  searchParams: Student;

  // Search lists
  loadingSearchLists = false;
  shifts: ShiftGradeSection[];
  grades: ShiftGradeSection[];
  sections: ShiftGradeSection[];

  // Selection.
  selectedStudent: Student;
  loadingReport: boolean;
  reportResult: SociometricReport[];

  // Chart
  chart: NgChart;
  serieLength = 0;

  constructor(
    private studentService: StudentService,
    private schoolYearService: SchoolYearService,
    private notification: NzNotificationService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.searchParams = new Student();
    this.searchParams.shift = new ShiftPeriodGrade();
    this.searchParams.grade = new ShiftPeriodGrade();
    this.searchParams.section = new ShiftPeriodGrade();

    this.shifts = new Array<ShiftGradeSection>();
    this.grades = new Array<ShiftGradeSection>();
    this.sections = new Array<ShiftGradeSection>();

    this.getAllShifts();
  }

  // List of all shifts, grades and sections of the current year.
  getAllShifts(): void {
    this.loadingSearchLists = true;
    this.schoolYearService.getSchoolYear().subscribe((schoolYear) => {
      const current = schoolYear.find((value) => value.status === 'En curso');

      if (current && current.shifts) {
        this.shifts = current.shifts.map((shiftDetail) => {
          return {
            id: shiftDetail['shift'].id,
            name: shiftDetail['shift'].name,
            children: shiftDetail['shift'].cycles.reduce((arr, cycle) => {
              cycle['gradeDetails'].forEach((gradeDetail) => {
                arr.push({
                  id: gradeDetail['grade'].id,
                  name: gradeDetail['grade'].name,
                  children: gradeDetail['sectionDetails'].map((sectionDetail) => {
                    return {
                      id: sectionDetail['section'].id,
                      name: sectionDetail['section'].name
                    };
                  })
                });
              });

              return arr;
            }, [])
          };
        });
      }
      this.loadingSearchLists = false;
    });
  }

  onChangeShift(shift: number): void {
    this.grades = shift ? this.shifts.find((x) => x.id === shift).children : new Array<ShiftGradeSection>();
    if (this.grades) this.grades.sort((a, b) => a.id - b.id);
    this.searchParams.grade.id = null;
  }

  onChangeGrade(grade: number): void {
    this.sections = grade ? this.grades.find((x) => x.id === grade).children : new Array<ShiftGradeSection>();
    if (this.sections) this.sections.sort((a, b) => a.id - b.id);
    this.searchParams.section.id = null;
  }

  getStudents(): void {
    this.loading = true;

    this.studentService.getStudents(null, this.searchParams, true, false).subscribe(
      (data) => {
        const results: Student[] = data['data'];

        if (!results || !results.length) {
          this.results = [];
          this.selectedStudent = null;
          this.reportResult = null;
          this.chart = null;
        } else if (results.length === 1) {
          this.selectStudent(results[0]);
        } else {
          this.results = results;
          this.selectedStudent = null;
          this.reportResult = null;
          this.chart = null;
        }

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.results = null;
    this.reportResult = null;

    this.loadingReport = true;
    this.reportService.getSociometricTestReport(this.selectedStudent.id).subscribe((r) => {
      this.reportResult = r;
      this.generateChart();
      this.loadingReport = false;
    });
  }

  exportExcel(): void {
    this.notification.create('info', 'Exportación en progreso', 'El archivo estará listo en unos momentos.');

    const fileName = `Pruebas sociométricas - 
      ${this.selectedStudent.firstname} ${this.selectedStudent.lastname} - 
      ${format(new Date(), 'ddMMyyyyHHmmss')}.xlsx
    `;

    /* Table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* Generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pruebas sociométricas');

    /* Save to file */
    XLSX.writeFile(wb, fileName);
  }

  generateChart(): void {
    this.serieLength = this.reportResult.map((r) => r.leadership).length;

    this.serieLength === 1 ? this.pieChart() : this.lineChart();
  }

  lineChart(): void {
    this.chart = new NgChart();

    this.chart.datasets = [
      {
        label: 'Aceptación',
        fill: false,
        lineTension: 0,
        data: this.reportResult.map((r) => r.acceptance)
      },
      {
        label: 'Rechazo',
        fill: false,
        lineTension: 0,
        data: this.reportResult.map((r) => r.rejection)
      },
      {
        label: 'Liderazgo',
        fill: false,
        lineTension: 0,
        data: this.reportResult.map((r) => r.leadership)
      }
    ];

    this.chart.labels = this.reportResult.map((r) => r.year.toString());
    this.chart.type = 'line';
    this.chart.colors = [
      {
        backgroundColor: 'rgba(33,206,47,0.2)',
        borderColor: 'rgba(33,206,47,1)',
        pointBackgroundColor: 'rgba(33,206,47,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(33,206,47,0.8)'
      },
      {
        backgroundColor: 'rgba(214,48,29,0.2)',
        borderColor: 'rgba(214,48,29,1)',
        pointBackgroundColor: 'rgba(214,48,29,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(214,48,29,0.8)'
      },
      {
        backgroundColor: 'rgba(2,48,71,0.2)',
        borderColor: 'rgba(2,48,71,1)',
        pointBackgroundColor: 'rgba(2,48,71,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(2,48,71,0.8)'
      }
    ];
    this.chart.legend = true;
    this.chart.options = {
      responsive: true,
      legend: { position: 'top' }
    };
  }

  pieChart(): void {
    this.chart = new NgChart();

    this.chart.labels = ['Aceptación', 'Rechazo', 'Liderazgo'];
    this.chart.data = [
      this.reportResult.map((r) => r.acceptance)[0],
      this.reportResult.map((r) => r.rejection)[0],
      this.reportResult.map((r) => r.leadership)[0]
    ];
    this.chart.type = 'pie';
    this.chart.legend = true;
    this.chart.colors = [
      {
        backgroundColor: ['rgba(33,206,47,1)', 'rgba(214,48,29,1)', 'rgba(2,48,71,1)']
      }
    ];
    this.chart.options = {
      responsive: true,
      legend: { position: 'top' },
      plugins: {
        datalabels: {
          formatter: (ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          }
        }
      }
    };
  }
}
