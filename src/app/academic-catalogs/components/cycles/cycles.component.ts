import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CycleService } from '../../shared/cycle.service';
import { Catalogue } from '../../shared/catalogue.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Pagination } from '../../../shared/pagination.model';

interface ItemData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.component.html',
  styleUrls: ['./cycles.component.css']
})
export class CyclesComponent implements OnInit {
  isVisible = false;
  cycles: Catalogue[];
  isLoading = false;
  isConfirmLoading = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  loading = false;
  tableSize = 'small';
  confirmModal?: NzModalRef;
  listOfData: Catalogue[];
  data = [];
  createCycle: FormGroup;
  pagination: Pagination;

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private cycleService: CycleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.createCycle = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(32)]
      ]
    });
  }

  showModal(): void {
    this.isVisible = true;
    this.resetForm();
  }

  resetForm(): void {
    this.createCycle.reset();
    for (const key in this.createCycle.controls) {
      this.createCycle.controls[key].markAsPristine();
      this.createCycle.controls[key].updateValueAndValidity();
    }
  }

  // Create cycle
  handleOk(): void {
    if (this.createCycle.valid) {
      this.isConfirmLoading = true;
      this.cycleService.createCycle(this.createCycle.value).subscribe(
        () => {
          this.isConfirmLoading = false;
          this.isVisible = false;
          this.message.success('Ciclo creado con éxito');
          this.search();
        },
        (error) => {
          this.isConfirmLoading = false;
          this.notification.create(
            'error',
            'Ocurrió un error al crear el ciclo. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 30000 }
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

  // Update cycle
  saveEdit(id: number, name: string): void {
    if (this.validateCycleName(this.editCache[id].data.name)) {
      const index = this.listOfData.findIndex((item) => item.id === id);

      // Confirm modal
      this.confirmModal = this.modal.confirm({
        nzTitle: `¿Desea actualizar el ciclo "${name}"?`,
        nzContent: `Actualizará el ciclo con nombre actual ${name} a ${this.editCache[id].data.name}. ¿Desea continuar con la acción?`,
        nzOnOk: () =>
          this.cycleService
            .updateCycle(this.editCache[id].data)
            .toPromise()
            .then(() => {
              this.message.success('Nombre del ciclo actualizado con éxito');
              Object.assign(this.listOfData[index], this.editCache[id].data);
              this.editCache[id].edit = false;
              this.isLoading = false;
            })
            .catch((error) => {
              this.isLoading = false;
              this.notification.create(
                'error',
                'Ocurrió un error al cambiar el nombre del ciclo. Por favor verifique lo siguiente:',
                error.message,
                { nzDuration: 30000 }
              );
            })
      });
    }
  }

  validateCycleName(name: string): boolean {
    const textValidation = RegExp(/[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]$/);

    if (!name.length) {
      this.notification.create(
        'error',
        'Ocurrió un error al cambiar el nombre del ciclo. Por favor verifique lo siguiente:',
        'El nombre es requerido.',
        { nzDuration: 30000 }
      );

      return false;
    } else if (!textValidation.test(name)) {
      this.notification.create(
        'error',
        'Ocurrió un error al cambiar el nombre del ciclo. Por favor verifique lo siguiente:',
        'El nombre debe contener solo letras.',
        { nzDuration: 30000 }
      );

      return false;
    } else if (name.length > 32) {
      this.notification.create(
        'error',
        'Ocurrió un error al cambiar el nombre del ciclo. Por favor verifique lo siguiente:',
        'El nombre debe contener máximo 32 caracteres.',
        { nzDuration: 30000 }
      );

      return false;
    }

    return true;
  }

  /* Delete cycle confirm modal */
  showConfirm(id: number, name: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar el ciclo "${name}"?`,
      nzContent: `Eliminará el ciclo "${name}". La acción no puede deshacerse.`,
      nzOnOk: () =>
        this.cycleService
          .deleteCycle(id)
          .toPromise()
          .then(() => {
            this.message.success(`El ciclo ${name} ha sido eliminado`);
            this.search();
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar el ciclo.', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }

  /* ---     Sort method      --- */
  recharge(params: NzTableQueryParams): void {
    this.loading = true;
    this.cycleService.searchCycle(params, params.pageIndex !== this.pagination.page).subscribe(
      (data) => {
        this.cycles = data['data'];
        this.listOfData = [...this.cycles];
        this.pagination = data['pagination'];
        this.loading = false;
        this.UpdateEditCache();
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los ciclos.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  search(): void {
    this.loading = true;

    this.cycleService.searchCycle(null, false).subscribe(
      (data) => {
        this.cycles = data['data'];
        this.pagination = data['pagination'];
        this.listOfData = [...this.cycles];
        this.loading = false;
        this.UpdateEditCache();
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al filtrar ciclos.', err.message, { nzDuration: 30000 });
        }
      }
    );
  }
}
