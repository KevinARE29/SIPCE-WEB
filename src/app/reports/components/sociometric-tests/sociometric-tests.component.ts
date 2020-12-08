import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { SchoolYearService } from 'src/app/school-year/shared/school-year.service';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { StudentService } from 'src/app/students/shared/student.service';
import { Student } from 'src/app/students/shared/student.model';

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

  constructor(
    private studentService: StudentService,
    private schoolYearService: SchoolYearService,
    private notification: NzNotificationService
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
        } else if (results.length === 1) {
          this.selectStudent(results[0]);
        } else {
          this.results = results;
          this.selectedStudent = null;
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
  }
}
