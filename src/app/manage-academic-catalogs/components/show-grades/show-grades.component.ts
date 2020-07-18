import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GradeService } from '../../shared/grade.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Pagination } from './../../../shared/pagination.model';
import { Grade } from '../../shared/grade.model';

@Component({
  selector: 'app-show-grades',
  templateUrl: './show-grades.component.html',
  styleUrls: ['./show-grades.component.css']
})
export class ShowGradesComponent implements OnInit {
  grades: Grade[];
  pagination: Pagination;
  loading = false;
  loadingSwitch = false;
  switchValue = false;
  searchValue = '';
  estado: string;
  mensajeExito: string;
  // paramsTwo: NzTableQueryParams;
  listOfDisplayData: Grade[];
  tableSize = 'small';
  icon = 'search';
  color = 'primary';
  confirmModal?: NzModalRef;

  constructor(
    private gradeService: GradeService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  /* Delete grade confirm modal */
  showConfirm(id: number): void {
    this.loadingSwitch = true;
    const element = this.grades.find((x) => x.id === id);
    if (element.active === true) {
      this.estado = 'Desactivar';
      this.mensajeExito = 'desactivado';
    } else {
      this.estado = 'Activar';
      this.mensajeExito = 'activado';
    }
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea ${this.estado} el grado "${element.name}"?`,
      nzContent: `${this.estado} el grado "${element.name}". La acción no puede deshacerse.`,
      nzOnOk: () =>
        this.gradeService
          .deleteGrade(id)
          .toPromise()
          .then(() => {
            this.message.success(`El grado ${element.name} ha sido ${this.mensajeExito}`);
            this.search();
            this.loadingSwitch = false;
            this.switchValue = !this.switchValue;
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];
            this.loadingSwitch = false;
            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al ' + this.estado + ' el grado.', err.message, {
                nzDuration: 0
              });
            }
          })
    });
  }

  search(): void {
    this.loading = true;

    this.gradeService.getGrade().subscribe(
      (data) => {
        this.grades = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.grades];
        this.loading = false;
      },
      (err) => {
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
