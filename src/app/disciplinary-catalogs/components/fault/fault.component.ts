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
import { Foul } from '../../shared/foul.model';

import { FoulTypes } from 'src/app/shared/enums/foul-types.enum';

@Component({
  selector: 'app-fault',
  templateUrl: './fault.component.html',
  styleUrls: ['./fault.component.css']
})
export class FaultComponent implements OnInit {
  permissions: Array<Permission> = [];
  fouls: Foul[];

  // Table.
  listOfDisplayData: Foul[];
  pagination: Pagination;
  loading = false;
  searchParams: Foul;
  isConfirmLoading = false;

  foulTypes = Object.values(FoulTypes).filter((k) => isNaN(Number(k)));

  // Update / delete modal.
  isVisible = false;
  modalTitle: string;
  editValue: boolean;
  foulForm: FormGroup;
  foulUpdated: Foul;
  idFoul: number;

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
    this.searchParams = new Foul();
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.setPermissions();
    this.foulForm = this.fb.group({
      foulsType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(256)]],
      numeral: ['', [Validators.required, Validators.maxLength(8), Validators.pattern('^([0-9]+[.])+[0-9]+$')]]
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

  /* ---      Main options      --- */
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
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];
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
    this.modalTitle = 'Crear falta';
    this.resetForm();
  }

  edit(data: Foul): void {
    this.editValue = true;
    this.modalTitle = 'Editar falta';
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

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }

  /* ---  Create and update foul  ---- */
  handleOk(): void {
    for (const i in this.foulForm.controls) {
      this.foulForm.controls[i].markAsDirty();
      this.foulForm.controls[i].updateValueAndValidity();
    }

    if (this.foulForm.valid) {
      if (this.editValue === true) {
        this.isConfirmLoading = true;
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
            this.message.success('Falta creada con éxito');
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

  // Delete.
  showConfirm(data: Foul): void {
    this.modal.confirm({
      nzTitle: `¿Desea eliminar la falta "${data.numeral}"?`,
      nzContent: `Esta acción no puede deshacerse. ¿Desea continuar con la acción?`,
      nzOnOk: () => {
        this.disciplinaryService.deleteFoul(data.id).subscribe(
          () => {
            this.message.success(`La falta ${data.numeral} ha sido eliminada`);
            this.search();
          },
          (err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar la falta', err.message, {
                nzDuration: 30000
              });
            }
          }
        );
      }
    });
  }
}
