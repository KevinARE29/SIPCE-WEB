import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GradeService } from '../../shared/grade.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Pagination } from './../../../shared/pagination.model';
import { Catalogue } from '../../shared/catalogue.model';

@Component({
  selector: 'app-show-grades',
  templateUrl: './show-grades.component.html',
  styleUrls: ['./show-grades.component.css']
})
export class ShowGradesComponent implements OnInit {
  grades: Catalogue[];
  pagination: Pagination;
  loading = false;
  loadingSwitch = false;
  switchValue = false;
  searchValue = '';
  // paramsTwo: NzTableQueryParams;
  listOfDisplayData: Catalogue[];
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

    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar el grado "${element.name}"?`,
      nzContent: `Eliminará el grado "${element.name}". La acción no puede deshacerse.`,
      nzOnOk: () =>
        this.gradeService
          .deleteGrade(id)
          .toPromise()
          .then(() => {
            this.message.success(`El grado ${element.name} ha sido eliminado`);
            this.search();
            this.loadingSwitch = false;
            this.switchValue = !this.switchValue;
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];
            this.loadingSwitch = false;
            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar el grado.', err.message, {
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
          this.notification.create('error', 'Ocurrió un error al obtener las secciones.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
