import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { SectionService } from '../../shared/section.service';
import { Catalogue } from '../../shared/catalogue.model';
import { Pagination } from '../../../shared/pagination.model';

interface ItemData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  isVisible = false;
  sectionJson;
  sections: Catalogue[];
  isLoading = false;
  isConfirmLoading = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  loading = false;
  tableSize = 'small';
  confirmModal?: NzModalRef;
  // Table objects
  pagination: Pagination;
  listOfData: Catalogue[];
  data = [];
  createSection: FormGroup;

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private sectionService: SectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // pagination variables
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    // create section form group
    this.createSection = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ0-9 ]+$'), Validators.maxLength(32)]
      ]
    });
  }

  showModal(): void {
    this.isVisible = true;
    this.resetForm();
  }

  resetForm(): void {
    this.createSection.reset();
    for (const key in this.createSection.controls) {
      this.createSection.controls[key].markAsPristine();
      this.createSection.controls[key].updateValueAndValidity();
    }
  }

  // Create section
  handleOk(): void {
    if (this.createSection.valid) {
      this.isConfirmLoading = true;
      this.sectionService.createSection(this.createSection.value).subscribe(
        () => {
          this.isConfirmLoading = false;
          this.isVisible = false;
          this.message.success('Sección creada con éxito');
          this.search();
        },
        (error) => {
          const statusCode = error.statusCode;
          const notIn = [401, 403];

          this.isLoading = false;

          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create(
              'error',
              'Ocurrió un error al crear sección. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 30000 }
            );
          }
        }
      );
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }

  UpdateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item['id']] = {
        edit: false,
        data: JSON.parse(JSON.stringify(item))
      };
    });
  }

  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  // Update section
  saveEdit(id: number, name: string): void {
    if (this.validateSectionName(this.editCache[id].data.name)) {
      const index = this.listOfData.findIndex((item) => item.id === id);

      // confirm modal
      this.confirmModal = this.modal.confirm({
        nzTitle: `¿Desea actualizar la sección "${name}"?`,
        nzContent: `Actualizará la sección con nombre actual ${name} a ${this.editCache[id].data.name}. ¿Desea continuar con la acción?`,
        nzOnOk: () =>
          this.sectionService
            .updateSection(this.editCache[id].data)
            .toPromise()
            .then(() => {
              this.isLoading = false;
              this.message.success('Nombre de la sección actualizada con éxito');
              Object.assign(this.listOfData[index], this.editCache[id].data);
              this.editCache[id].edit = false;
            })
            .catch((error) => {
              const statusCode = error.statusCode;
              const notIn = [401, 403];

              this.isLoading = false;

              if (!notIn.includes(statusCode) && statusCode < 500) {
                this.notification.create(
                  'error',
                  'Ocurrió un error al cambiar el nombre de la sección. Por favor verifique lo siguiente:',
                  error.message,
                  { nzDuration: 30000 }
                );
              }
            })
      });
    }
  }

  validateSectionName(name: string): boolean {
    const textValidation = RegExp(/[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ0-9 ]$/);

    if (!name.length) {
      this.notification.create(
        'error',
        'Ocurrió un error al cambiar el nombre de la sección. Por favor verifique lo siguiente:',
        'El nombre es requerido.',
        { nzDuration: 30000 }
      );

      return false;
    } else if (!textValidation.test(name)) {
      this.notification.create(
        'error',
        'Ocurrió un error al cambiar el nombre de la sección. Por favor verifique lo siguiente:',
        'El nombre puede contener letras y números.',
        { nzDuration: 30000 }
      );

      return false;
    } else if (name.length > 32) {
      this.notification.create(
        'error',
        'Ocurrió un error al cambiar el nombre de la sección. Por favor verifique lo siguiente:',
        'El nombre debe contener máximo 32 caracteres.',
        { nzDuration: 30000 }
      );

      return false;
    }

    return true;
  }

  // Delete section confirm modal
  showConfirm(id: number, name: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar la sección "${name}"?`,
      nzContent: `Eliminará la sección "${name}". La acción no puede deshacerse.`,
      nzOnOk: () =>
        this.sectionService
          .deleteSection(id)
          .toPromise()
          .then(() => {
            this.message.success(`La sección ${name} ha sido eliminada`);
            this.search();
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar la sección.', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }

  search(): void {
    this.loading = true;

    this.sectionService.searchSection(null, false).subscribe(
      (data) => {
        this.sections = data['data'];
        this.pagination = data['pagination'];
        this.listOfData = [...this.sections];
        this.loading = false;
        this.UpdateEditCache();
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al filtrar secciones.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  /* ---     Sort method      --- */
  recharge(params: NzTableQueryParams): void {
    this.loading = true;
    this.sectionService.searchSection(params, params.pageIndex !== this.pagination.page).subscribe(
      (data) => {
        this.sections = data['data'];
        this.pagination = data['pagination'];
        this.listOfData = [...this.sections];
        this.loading = false;
        this.UpdateEditCache();
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener las secciones.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
