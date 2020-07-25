import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShiftService } from '../../shared/shift.service';
import { ShiftPeriodGrade } from '../../shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-show-shift',
  templateUrl: './show-shift.component.html',
  styleUrls: ['./show-shift.component.css']
})
export class ShowShiftComponent implements OnInit {
  shifts: ShiftPeriodGrade[];
  loading = false;
  status: string;
  successMessage: string;
  confirmModal?: NzModalRef;

  constructor(
    private shiftService: ShiftService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getShift();
  }

  getShift(): void {
    this.loading = true;
    this.shiftService.getShift().subscribe(
      (response) => {
        this.shifts = response['data'];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los turnos.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }

  /* Deactivate/activate shift confirm modal */
  showConfirm(id: number): void {
    const element = this.shifts.find((x) => x.id === id);
    if (element.active === true) {
      this.status = 'desactivar';
      this.successMessage = 'desactivado';
    } else {
      this.status = 'activar';
      this.successMessage = 'activado';
    }

    this.shiftService.deleteShift(id).subscribe(
      () => {
        this.message.success(`El turno ${element.name} ha sido ${this.successMessage}`);
        element.active = !element.active;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];
        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al ' + this.status + ' el turno.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
