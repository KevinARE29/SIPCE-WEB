import { Component, OnInit } from '@angular/core';


import { compareDesc, subMonths, differenceInCalendarDays } from 'date-fns';

import { AuthService } from 'src/app/login/shared/auth.service';
import { UserService } from 'src/app/users/shared/user.service';

import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { Permission } from 'src/app/shared/permission.model';
import { Student } from 'src/app/students/shared/student.model';
import { Session } from '../../shared/session.model';

export interface ISessions {
  student: Student;
  session: Session;
}
export interface Shift {
  id: number;
  name: string;
  grades: ShiftPeriodGrade[];
}
@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  permissions: Permission[] = [];
  actions: unknown[] = [];

  // Search params
  searchStudentParams: Student;
  searchSessionParams: Session;
  shifts: Shift[];
  grades: ShiftPeriodGrade[];

  // Table variables
  loading = false;
  listOfDisplayData: Student[];
  pagination: Pagination;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.init();
    this.getProfile();
    this.setPermissions();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchSessionParams = new Session();
    this.searchStudentParams = new Student();
    this.searchStudentParams.currentShift = new ShiftPeriodGrade();
    this.searchStudentParams.grade = new ShiftPeriodGrade();

    this.shifts = new Array<Shift>();
    this.grades = new Array<ShiftPeriodGrade>();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  //#region Control page permissions
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    // this.permissions.push(new Permission(, ''));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);
      p.allow = index == -1 ? false : true;

      // Determine which actions are allowed in the table
      if (p.allow && p.id !== 17) this.actions.push(p);
    });
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }
  //#endregion

  getProfile(): void {
    this.loading = true;

    this.userService.getUserProfile().subscribe((data) => {
      if (data['counselorAssignation']) {
        Object.values(data['counselorAssignation']).forEach((assignation) => {
          const grades = new Array<ShiftPeriodGrade>();
          assignation[0]['gradeDetails'].forEach((grade) => {
            grades.push(grade.grade);
          });

          this.shifts.push({ id: assignation[0]['shift'].id, name: assignation[0]['shift'].name, grades });
        });
      }

      if (this.shifts.length) console.log(this.shifts); // this.getSessions();
      this.loading = false;
    });
  }

  getSessions(params): void {
    console.log(params);
  }

  cleanGradesSelect(shift: number): void {
    this.grades = shift ? this.shifts.find((x) => x.id === shift).grades : new Array<ShiftPeriodGrade>();
    if (this.grades) this.grades.sort((a, b) => a.id - b.id);
    this.getSessions(null);
    this.searchStudentParams.grade.id = null;
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchSessionParams['registeredAt'][0] = result[0];
    this.searchSessionParams['registeredAt'][1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
