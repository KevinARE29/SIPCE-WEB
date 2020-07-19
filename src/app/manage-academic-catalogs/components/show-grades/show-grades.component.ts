import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GradeService } from '../../shared/grade.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Pagination } from './../../../shared/pagination.model';
import { ShiftPeriodGrade } from '../../shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-show-grades',
  templateUrl: './show-grades.component.html',
  styleUrls: ['./show-grades.component.css']
})
export class ShowGradesComponent implements OnInit {
  grades: ShiftPeriodGrade[];
  pagination: Pagination;
  loading = false;
  estado: string;
  mensajeExito: string;
  listOfDisplayData: ShiftPeriodGrade[];
  tableSize = 'small';
  confirmModal?: NzModalRef;

  constructor(
    private gradeService: GradeService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  /* Deactivate/activate grade confirm modal */
  showConfirm(id: number): void {
    const element = this.grades.find((x) => x.id === id);
    if (element.active === true) {
      this.estado = 'Desactivar';
      this.mensajeExito = 'desactivado';
    } else {
      this.estado = 'Activar';
      this.mensajeExito = 'activado';
    }

    this.gradeService.deleteGrade(id).subscribe(
      () => {
        this.message.success(`El grado ${element.name} ha sido ${this.mensajeExito}`);
        element.active = !element.active;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];
        this.refreshTableData();
        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al ' + this.estado + ' el grado.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }

  /* methos to refresh grades data on table */
  refreshTableData(): void {
    this.loading = true;

    this.gradeService.searchGrade(null, false).subscribe(
      (data) => {
        this.grades = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.grades];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al filtrar los grados.', err.message, { nzDuration: 0 });
        }
      }
    );
  }

  /* ---     sort method      --- */
  recharge(params: NzTableQueryParams): void {
    this.loading = true;
    this.gradeService.searchGrade(params, params.pageIndex !== this.pagination.page).subscribe(
      (data) => {
        this.grades = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.grades];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los grados.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
