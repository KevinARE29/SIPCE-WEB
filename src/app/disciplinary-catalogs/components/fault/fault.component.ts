import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisciplinaryCatalogService } from './../../shared/disciplinary-catalog.service';
import { AuthService } from '../../../login/shared/auth.service';
import { Permission } from '../../../shared/permission.model';

import { Pagination } from './../../../shared/pagination.model';
import { Foul } from '../../shared/foul.model';

@Component({
  selector: 'app-fault',
  templateUrl: './fault.component.html',
  styleUrls: ['./fault.component.css']
})
export class FaultComponent implements OnInit {
  permissions: Array<Permission> = [];
  fouls: Foul[];
  foulUpdated: Foul;
  idFoul: number;
  isVisible = false;
  pagination: Pagination;
  loading = false;
  listOfDisplayData: Foul[];
  tableSize = 'small';
  icon = 'search';
  color = 'primary';
  confirmModal?: NzModalRef;
  foulForm: FormGroup;
  isConfirmLoading = false;
  editValue: boolean;
  searchParams: Foul;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private disciplinaryService: DisciplinaryCatalogService,
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.searchParams = new Foul();
    this.editValue = false;
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.setPermissions();
    this.foulForm = this.fb.group({
      foulsType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(256)]],
      numeral: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }

  /* ---      Control page permissions      --- */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;
    this.permissions.push(new Permission(26, 'Gestionar faltas'));
    this.permissions.push(new Permission(27, 'Listar faltas'));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);

      p.allow = index == -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }

  showModal(): void {
    this.isVisible = true;
    this.resetForm();
  }

  AllowEditing(data: Foul): void {
    this.idFoul = null;
    this.editValue = true;
    this.idFoul = data.id;
    this.resetForm();
    this.foulForm.get('numeral').setValue(data.numeral);
    this.foulForm.get('description')?.setValue(data.description);
    this.foulForm.get('foulsType').setValue(data.foulsType);
    this.isVisible = true;
  }

  resetForm(): void {
    this.foulForm.reset();
    for (const key in this.foulForm.controls) {
      this.foulForm.controls[key].markAsPristine();
      this.foulForm.controls[key].updateValueAndValidity();
    }
  }

  /* ---  Create and update sanction  ---- */
  handleOk(): void {
    if (this.foulForm.valid) {
      if (this.editValue === true) {
        this.foulUpdated = this.foulForm.value;
        this.disciplinaryService.updateFoul(this.foulUpdated, this.idFoul).subscribe(
          () => {
            this.editValue = false;
            this.isConfirmLoading = false;
            this.isVisible = false;
            this.message.success('Falta actualizada con éxito');
            this.search();
          },
          (error) => {
            this.editValue = false;
            this.isConfirmLoading = false;
            this.notification.create(
              'error',
              'Ocurrió un error al actualizar la falta. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 30000 }
            );
          }
        );
      } else {
        this.isConfirmLoading = true;
        this.disciplinaryService.createFoul(this.foulForm.value).subscribe(
          () => {
            this.isConfirmLoading = false;
            this.isVisible = false;
            this.message.success('falta creada con éxito');
            this.search();
          },
          (error) => {
            this.isConfirmLoading = false;
            this.notification.create(
              'error',
              'Ocurrió un error al crear la falta. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 30000 }
            );
          }
        );
      }
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }

  getFouls(params: NzTableQueryParams): void {
    this.loading = true;

    this.disciplinaryService.getFouls(params, this.searchParams, params.pageIndex !== this.pagination.page).subscribe(
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

  search(): void {
    this.loading = true;

    this.disciplinaryService.getFouls(null, this.searchParams, false).subscribe(
      (data) => {
        this.fouls = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.fouls];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al filtrar las faltas.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  showConfirm(id: number, numeral: string, description: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar la falta "${numeral}"?`,
      nzContent: `Descripción: "${description}". ¿Desea continuar con la acción?`,
      nzOnOk: () =>
        this.disciplinaryService
          .deleteFoul(id)
          .toPromise()
          .then(() => {
            this.message.success(`La falta ${numeral} ha sido eliminada`);
            this.search();
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar la falta', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }
}
