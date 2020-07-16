import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SectionsService } from './../../shared/sections.service';
import { Section } from './../../shared/section.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  sections: Section[];
  isLoading = false;
  isConfirmLoading = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

  loading = false;
  tableSize = 'small';
  confirmModal?: NzModalRef;
  listOfData: Section[];
  data = [];
  createSection: FormGroup;

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private sectionService: SectionsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getSections();
    // create section form builder
    this.createSection = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚ.-]+')]]
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

  // create section function
  handleOk(): void {
    if (this.createSection.valid) {
      this.isConfirmLoading = true;
      this.sectionService.createSection(this.createSection.value).subscribe(
        () => {
          this.isConfirmLoading = false;
          this.isVisible = false;
          this.message.success('Sección creada con éxito');
          this.getSections();
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

  /* Get sections method   this.roles = data['data']; */
  getSections(): void {
    this.loading = true;
    this.sectionService.getSections().subscribe((data) => {
      this.sections = data['data'];
      console.log(this.sections);
      this.listOfData = [...this.sections];
      console.log(this.listOfData);
      this.loading = false;
      this.UpdateEditCache();
    });
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

  saveEdit(id: number, name: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.sectionJson = {
      name: this.editCache[id].data.name
    };
    console.log(this.editCache[id].data.name);
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
    console.log(this.editCache[id].data.name);
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
            this.getSections();
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
}
