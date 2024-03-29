import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Student } from '../../shared/student.model';
import { Permission } from 'src/app/shared/permission.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { StudentService } from '../../shared/student.service';
import { AuthService } from 'src/app/login/shared/auth.service';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { GradeService } from 'src/app/academic-catalogs/shared/grade.service';
import { StudentStatus } from 'src/app/shared/student-status.enum';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  permissions: Permission[] = [];
  confirmModal?: NzModalRef;
  actions: unknown[] = [];

  // Search params
  searchParams: Student;
  statusSwitch: boolean;

  // Select lists
  statuses: string[];
  grades: ShiftPeriodGrade;

  // Table variables
  loading = false;
  listOfDisplayData: Student[];
  pagination: Pagination;

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
    private authService: AuthService,
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.init();
    this.setPermissions();
    this.getGrades();
  }

  init(): void {
    this.statusSwitch = true;
    this.searchParams = new Student();
    this.searchParams.grade = new ShiftPeriodGrade();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.setStatuses();
  }

  /* ------      Control page permissions      ------ */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.permissions.push(new Permission(17, 'Create student'));
    this.permissions.push(new Permission(21, 'eye'));
    this.permissions.push(new Permission(20, 'edit'));
    this.permissions.push(new Permission(24, 'delete'));

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

  /* ------      Main actions      ------ */
  getStudents(params: NzTableQueryParams): void {
    const paginate = params ? params.pageIndex !== this.pagination.page : false;
    this.loading = true;

    this.studentService.getStudents(params, this.searchParams, this.statusSwitch, paginate).subscribe(
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

  showConfirm(id: number): void {
    const element = this.listOfDisplayData.find((x) => x.id === id);

    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar al estudiante ${element.firstname} ${element.lastname}?`,
      nzContent: `Eliminará al estudiante ${element.firstname} ${element.lastname} del sistema. La acción no puede deshacerse.`,

      nzOnOk: () =>
        this.studentService
          .deleteStudent(id)
          .toPromise()
          .then(() => {
            this.message.success(`El estudiante ${element.firstname} ${element.lastname} ha sido eliminado`);
            this.getStudents(null);
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar al estudiante.', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }

  /* ------      Complementary methods      ------ */
  getGrades(): void {
    this.gradeService.getAllGrades().subscribe((data) => {
      this.grades = data['data'];
    });
  }

  setStatuses(): void {
    this.statuses = new Array<string>();

    if (this.statusSwitch) {
      this.statuses.push(StudentStatus[1]);
      this.statuses.push(StudentStatus[2]);
      this.statuses.push(StudentStatus[3]);
    } else {
      this.statuses.push(StudentStatus[4]);
      this.statuses.push(StudentStatus[5]);
      this.statuses.push(StudentStatus[6]);
    }
  }

  statusToggle(): void {
    this.setStatuses();
    this.getStudents(null);
  }
}
