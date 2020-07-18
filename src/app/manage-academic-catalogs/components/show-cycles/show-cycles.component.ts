import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CycleService } from '../../shared/cycle.service';
import { Catalogue } from '../../shared/catalogue.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface ItemData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-show-cycles',
  templateUrl: './show-cycles.component.html',
  styleUrls: ['./show-cycles.component.css']
})
export class ShowCyclesComponent implements OnInit {
  isVisible = false;
  cycleJson;
  cycles: Catalogue[];
  isLoading = false;
  isConfirmLoading = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  paramsTwo: NzTableQueryParams;
  loading = false;
  tableSize = 'small';
  confirmModal?: NzModalRef;
  listOfData: Catalogue[];
  data = [];
  createCycle: FormGroup;

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private cycleService: CycleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createCycle = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚ ]+$'), Validators.maxLength(32)]
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

  /* create cycle function */
  handleOk(): void {
    if (this.createCycle.valid) {
      this.isConfirmLoading = true;
      this.cycleService.createCycle(this.createCycle.value).subscribe(
        () => {
          this.isConfirmLoading = false;
          this.isVisible = false;
          this.message.success('Ciclo creado con éxito');
          this.recharge(this.paramsTwo);
        },
        (error) => {
          this.isConfirmLoading = false;
          this.notification.create(
            'error',
            'Ocurrió un error al crear el ciclo. Por favor verifique lo siguiente:',
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

  /* update cycle function */
  saveEdit(id: number, name: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.cycleJson = {
      name: this.editCache[id].data.name
    };
    // confirm modal
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea actualizar el ciclo "${name}"?`,
      nzContent: `Actualizará el ciclo con nombre actual ${name} a ${this.editCache[id].data.name}. ¿Desea continuar con la acción? .`,
      nzOnOk: () =>
        this.cycleService
          .updateCycle(this.cycleJson, id)
          .toPromise()
          .then(() => {
            this.isLoading = false;
            this.message.success('Nombre del ciclo actualizado con éxito');
            Object.assign(this.listOfData[index], this.editCache[id].data);
            this.editCache[id].edit = false;
          })
          .catch((error) => {
            this.isLoading = false;
            this.notification.create(
              'error',
              'Ocurrió un error al cambiar el nombre del ciclo. Por favor verifique lo siguiente:',
              error.message,
              { nzDuration: 0 }
            );
          })
    });
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
            this.recharge(this.paramsTwo);
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar el ciclo.', err.message, {
                nzDuration: 0
              });
            }
          })
    });
  }

  /* ---     sort method      --- */
  recharge(params: NzTableQueryParams): void {
    this.loading = true;
    this.cycleService.searchCycle(params).subscribe(
      (data) => {
        this.cycles = data['data'];
        this.listOfData = [...this.cycles];
        this.loading = false;
        this.UpdateEditCache();
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los ciclos.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
