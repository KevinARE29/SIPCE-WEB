import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SectionService } from '../../shared/section.service';
import { Catalogue } from '../../shared/catalogue.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Pagination } from './../../../shared/pagination.model';

interface ItemData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-show-sections',
  templateUrl: './show-sections.component.html',
  styleUrls: ['./show-sections.component.css']
})
export class ShowSectionsComponent implements OnInit {
  isVisible = false;
  sectionJson;
  sections: Catalogue[];
  isLoading = false;
  isConfirmLoading = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  paramsTwo: NzTableQueryParams;
  loading = false;
  tableSize = 'small';
  confirmModal?: NzModalRef;
  // table objects
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
        [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚ ]+$'), Validators.maxLength(15)]
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

  /* create section function */
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
          this.isConfirmLoading = false;
          this.notification.create(
            'error',
            'Ocurrió un error al crear la sección. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 0 }
          );
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

  /* update section function */
  saveEdit(id: number, name: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.sectionJson = {
      name: this.editCache[id].data.name
    };
    // confirm modal
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea actualizar la sección "${name}"?`,
      nzContent: `Actualizará la sección con nombre actual ${name} a ${this.editCache[id].data.name}. ¿Desea continuar con la acción? .`,
      nzOnOk: () =>
        this.sectionService
          .updateSection(this.sectionJson, id)
          .toPromise()
          .then(() => {
            this.isLoading = false;
            this.message.success('Nombre de la sección actualizada con éxito');
            Object.assign(this.listOfData[index], this.editCache[id].data);
            this.editCache[id].edit = false;
          })
          .catch((error) => {
            this.isLoading = false;
            this.notification.create(
              'error',
              'Ocurrió un error al cambiar el nombre de la sección. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 0 }
            );
          })
    });
  }

  /* Delete section confirm modal */
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
                nzDuration: 0
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
          this.notification.create('error', 'Ocurrió un error al filtrar secciones.', err.message, { nzDuration: 0 });
        }
      }
    );
  }

  /* ---     sort method      --- */
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
            nzDuration: 0
          });
        }
      }
    );
  }
}
