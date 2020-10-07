import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  loading = false;
  confirmModal?: NzModalRef;
  isVisible = false;

  panels = [
    {
      active: true,
      disabled: false,
      name: 'Lunes'
    },
    {
      active: false,
      disabled: true,
      name: 'Martes'
    },
    {
      active: false,
      disabled: false,
      name: 'Miércoles'
    },
    {
      active: false,
      disabled: false,
      name: 'Jueves'
    },
    {
      active: false,
      disabled: false,
      name: 'Viernes'
    }
  ];

  data = ['8:00 - 9:00 am', '10:00 - 12:00 am', '2:00 - 3:00 pm'];
  constructor(private modal: NzModalService) {}

  ngOnInit(): void {}

  /* Delete schedule confirm modal */
  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar el horario?`,
      nzContent: `Eliminará el horario. La acción no puede deshacerse.`
      //  nzOnOk: () =>
      // this.cycleService
      //   .deleteCycle(id)
      //   .toPromise()
      //   .then(() => {
      //     this.message.success(`El ciclo ${name} ha sido eliminado`);
      //     this.search();
      //   })
      //   .catch((err) => {
      //     const statusCode = err.statusCode;
      //     const notIn = [401, 403];

      //     if (!notIn.includes(statusCode) && statusCode < 500) {
      //       this.notification.create('error', 'Ocurrió un error al eliminar el ciclo.', err.message, {
      //         nzDuration: 0
      //       });
      //     }
      //   })
    });
  }

  showModal(): void {
    this.isVisible = true;
    this.resetForm();
  }

  resetForm(): void {
    // this.createCycle.reset();
    // for (const key in this.createCycle.controls) {
    //   this.createCycle.controls[key].markAsPristine();
    //   this.createCycle.controls[key].updateValueAndValidity();
    // }
  }

  /* create cycle function */
  handleOk(): void {
    // if (this.createCycle.valid) {
    //   this.isConfirmLoading = true;
    //   this.cycleService.createCycle(this.createCycle.value).subscribe(
    //     () => {
    //       this.isConfirmLoading = false;
    //       this.isVisible = false;
    //       this.message.success('Ciclo creado con éxito');
    //       this.search();
    //     },
    //     (error) => {
    //       this.isConfirmLoading = false;
    //       this.notification.create(
    //         'error',
    //         'Ocurrió un error al crear el ciclo. Por favor verifique lo siguiente:',
    //         error.message,
    //         { nzDuration: 0 }
    //       );
    //     }
    //   );
    //  }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }
}
