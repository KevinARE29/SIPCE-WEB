import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  sanctions: Sanction[];
  isVisible = false;
  pagination: Pagination;
  loading = false;
  searchValue = '';
  listOfDisplayData: Sanction[];
  tableSize = 'small';
  icon = 'search';
  color = 'primary';
  confirmModal?: NzModalRef;
  sanctionForm: FormGroup;
  isConfirmLoading = false;
  editValue: boolean;

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
        [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(32)]
      ],
      description: ['', [Validators.required, Validators.maxLength(256)]]
    });
  }

  /* ---      Control page permissions      --- */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;
    console.log(permissions);
    this.permissions.push(new Permission(26, 'Gestionar faltas'));
    this.permissions.push(new Permission(27, 'Listar faltas'));
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
  recharge(params: NzTableQueryParams): void {
    this.loading = true;

    this.disciplinaryService.searchSanctions(params, params.pageIndex !== this.pagination.page).subscribe(
      (data) => {
        this.sanctions = data['data'];
        console.log(this.sanctions);
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.sanctions];
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

  showModal(): void {
    this.isVisible = true;
    this.resetForm();
  }

  AllowEditing(data: Sanction): void {
    this.editValue = true;
    this.resetForm();
    console.log(data);
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

  // Create sanction
  handleOk(): void {
    if (this.sanctionForm.valid) {
      if (this.editValue === true) {
        this.isConfirmLoading = true;
        this.disciplinaryService.updateSanction(this.sanctionForm.value).subscribe(
          () => {
            this.isConfirmLoading = false;
            this.isVisible = false;
            this.message.success('Sanción actualizada con éxito');
            this.search();
          },
          (error) => {
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

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }

  search(): void {
    this.loading = true;

    this.disciplinaryService.searchSanctions(null, false).subscribe(
      (data) => {
        this.sanctions = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.sanctions];
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

  showConfirm(id: number, name: string, description: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar la sanción "${name}"?`,
      nzContent: `Descripción: "${description}". ¿Desea continuar con la acción?`,
      nzOnOk: () =>
        this.disciplinaryService
          .deleteSanction(id)
          .toPromise()
          .then(() => {
            this.message.success(`La sanción ${name} ha sido eliminada`);
            this.search();
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar la sanción', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }
}
