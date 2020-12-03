import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { DisciplinaryCatalogService } from './../../shared/disciplinary-catalog.service';
import { AuthService } from '../../../login/shared/auth.service';
import { Permission } from '../../../shared/permission.model';
import { Pagination } from './../../../shared/pagination.model';
import { Sanction } from '../../shared/sanction.model';

@Component({
  selector: 'app-sanction',
  templateUrl: './sanction.component.html',
  styleUrls: ['./sanction.component.css']
})
export class SanctionComponent implements OnInit {
  permissions: Array<Permission> = [];

  // Table.
  listOfDisplayData: Sanction[];
  pagination: Pagination;
  loading = false;
  searchValue = '';
  isConfirmLoading = false;

  // Update / delete modal.
  isVisible = false;
  editValue: boolean;
  sanctionForm: FormGroup;
  sanctionsUpdated: Sanction;
  idSanction: number;

  // Expant table
  expandSet = new Set<number>();

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private disciplinaryService: DisciplinaryCatalogService,
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.editValue = false;
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.setPermissions();
    this.sanctionForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(128)]
      ],
      description: ['', [Validators.required, Validators.maxLength(256)]]
    });
  }

  /* ---      Control page permissions      --- */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;
    this.permissions.push(new Permission(28, 'Gestionar sanciones'));
    this.permissions.push(new Permission(29, 'Listar sanciones'));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);

      p.allow = index == -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }

  /* ---      Main options      --- */
  getSanctions(params: NzTableQueryParams): void {
    this.loading = true;

    this.disciplinaryService
      .searchSanctions(params, this.searchValue, params.pageIndex !== this.pagination.page)
      .subscribe(
        (data) => {
          this.pagination = data['pagination'];
          this.listOfDisplayData = data['data'];
          this.loading = false;
        },
        (err) => {
          const statusCode = err.statusCode;
          const notIn = [401, 403];

          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create('error', 'Ocurrió un error al obtener las sanciones.', err.message, {
              nzDuration: 30000
            });
          }
        }
      );
  }

  search(): void {
    this.loading = true;

    this.disciplinaryService.searchSanctions(null, this.searchValue, false).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al filtrar las sanciones.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  // Expand table
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  // Create / update modal.
  create(): void {
    this.isVisible = true;
    this.resetForm();
  }

  edit(data: Sanction): void {
    this.editValue = true;
    this.idSanction = data.id;
    this.resetForm();
    this.sanctionForm.get('name').setValue(data.name);
    this.sanctionForm.get('description')?.setValue(data.description);
    this.isVisible = true;
  }

  resetForm(): void {
    this.sanctionForm.reset();
    for (const key in this.sanctionForm.controls) {
      this.sanctionForm.controls[key].markAsPristine();
      this.sanctionForm.controls[key].updateValueAndValidity();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }

  /* ---  Create and update sanction  ---- */
  handleOk(): void {
    if (this.sanctionForm.valid) {
      if (this.editValue === true) {
        this.sanctionsUpdated = this.sanctionForm.value;
        this.disciplinaryService.updateSanction(this.sanctionsUpdated, this.idSanction).subscribe(
          () => {
            this.editValue = false;
            this.isConfirmLoading = false;
            this.isVisible = false;
            this.message.success('Sanción actualizada con éxito');
            this.search();
          },
          (error) => {
            this.editValue = false;
            this.isConfirmLoading = false;
            this.notification.create(
              'error',
              'Ocurrió un error al actualizar la sanción. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 30000 }
            );
          }
        );
      } else {
        this.isConfirmLoading = true;
        this.disciplinaryService.createSanction(this.sanctionForm.value).subscribe(
          () => {
            this.isConfirmLoading = false;
            this.isVisible = false;
            this.message.success('Sanción creada con éxito');
            this.search();
          },
          (error) => {
            this.isConfirmLoading = false;
            this.notification.create(
              'error',
              'Ocurrió un error al crear la sanción. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 30000 }
            );
          }
        );
      }
    }
  }

  // Delete.
  showConfirm(data: Sanction): void {
    this.modal.confirm({
      nzTitle: `¿Desea eliminar la sanción "${data.name}"?`,
      nzContent: `Esta acción no puede deshacerse. ¿Desea continuar con la acción?`,
      nzOnOk: () => {
        this.disciplinaryService.deleteSanction(data.id).subscribe(
          () => {
            this.message.success(`La sanción ${data.name} ha sido eliminada`);
            this.search();
          },
          (err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar la sanción', err.message, {
                nzDuration: 30000
              });
            }
          }
        );
      }
    });
  }
}
