import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { UserService } from 'src/app/users/shared/user.service';
import { SchoolYearService } from 'src/app/school-year/shared/school-year.service';
import { HistoryService } from '../../shared/history.service';
import { StudentWithHistory } from '../../shared/student-with-history.model';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Pagination } from 'src/app/shared/pagination.model';

class ShiftGradeSection {
  id: number;
  name: string;
  children?: ShiftGradeSection[];
}

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {
  loading = false;
  listOfDisplayData: StudentWithHistory[];

  // Search params
  searchParams: StudentWithHistory;
  pagination: Pagination;

  // Search lists
  loadingSearchLists = false;
  shifts: ShiftGradeSection[];
  grades: ShiftGradeSection[];
  sections: ShiftGradeSection[];

  constructor(
    private historyService: HistoryService,
    private schoolYearService: SchoolYearService,
    private notification: NzNotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.searchParams = new StudentWithHistory();
    this.searchParams.shift = new ShiftPeriodGrade();
    this.searchParams.grade = new ShiftPeriodGrade();
    this.searchParams.section = new ShiftPeriodGrade();

    this.shifts = new Array<ShiftGradeSection>();
    this.grades = new Array<ShiftGradeSection>();
    this.sections = new Array<ShiftGradeSection>();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.getSearchLists();
  }

  getSearchLists(): void {
    this.loadingSearchLists = true;

    this.userService.getUserProfile().subscribe((data) => {
      // If roles include one of those, show all shifts.
      if (
        (data['roles'] as unknown[]).some((role) => {
          return ['Director', 'Coordinador de Ciclo', 'Orientador'].includes(role['name']);
        })
      ) {
        this.getAllShifts();

        // Else, show only the sections assigned to teachers and auxiliary teachers.
      } else {
        // Set the filters for teachers.
        if (data['teacherAssignation']) {
          (data['teacherAssignation'] as unknown[]).forEach((assigment) => {
            const shift: ShiftGradeSection = {
              id: assigment['shift'].id,
              name: assigment['shift'].name
            };

            const grade: ShiftGradeSection = {
              id: assigment['grade'].id,
              name: assigment['grade'].name
            };
            const section: ShiftGradeSection = {
              id: assigment['section'].id,
              name: assigment['section'].name
            };

            grade.children = [section];
            shift.children = [grade];

            this.shifts.push(shift);
          });
        }

        // Set the filters for auxiliary teachers.
        if (data['auxTeacherAssignation']) {
          Object.values(data['auxTeacherAssignation']).forEach((assignation: unknown[]) => {
            assignation.forEach((assigment) => {
              // For each shift, check if it's already registered.
              let shift = this.shifts.find((value) => value.id === assigment['shift'].id);

              if (!shift) {
                shift = {
                  id: assigment['shift'].id,
                  name: assigment['shift'].name,
                  children: []
                };

                this.shifts.push(shift);
              }

              // For each grade on the shift, check if it's already registered.
              assigment['gradeDetails'].forEach((gradeDetail) => {
                let grade = shift.children.find((value) => value.id === gradeDetail['grade'].id);

                if (!grade) {
                  grade = {
                    id: gradeDetail['grade'].id,
                    name: gradeDetail['grade'].name,
                    children: []
                  };

                  shift.children.push(grade);
                }

                // For each section on the grade, check if it's already registered.
                gradeDetail['sectionDetails'].forEach((sectionDetail) => {
                  let section = grade.children.find((value) => value.id === sectionDetail['section'].id);

                  if (!section) {
                    section = {
                      id: sectionDetail['section'].id,
                      name: sectionDetail['section'].name
                    };

                    grade.children.push(section);
                  }
                });
              });
            });
          });
        }

        this.loadingSearchLists = false;
      }
    });
  }

  // List of all shifts, grades and sections of the current year.
  getAllShifts(): void {
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
    this.getHistory(null);
  }

  onChangeGrade(grade: number): void {
    this.sections = grade ? this.grades.find((x) => x.id === grade).children : new Array<ShiftGradeSection>();
    if (this.sections) this.sections.sort((a, b) => a.id - b.id);
    this.searchParams.section.id = null;
    this.getHistory(null);
  }

  getHistory(params: NzTableQueryParams): void {
    this.loading = true;

    this.historyService.getStudents(params, this.searchParams).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];

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
}
