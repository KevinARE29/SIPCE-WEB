import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PeriodService } from '../../shared/period.service';
import { ShiftPeriodGrade } from '../../shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.css']
})
export class PeriodsComponent implements OnInit {
  periods: ShiftPeriodGrade[];
  loading = false;
  status: string;
  successMessage: string;
  confirmModal?: NzModalRef;

  constructor(
    private periodService: PeriodService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getPeriod();
  }

  getPeriod(): void {
    this.loading = true;
    this.periodService.getPeriod().subscribe(
      (response) => {
        this.periods = response['data'];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los periodos.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  /* Deactivate/activate period confirm modal */
  showConfirm(id: number): void {
    const element = this.periods.find((x) => x.id === id);

    if (element.active === true) {
      this.status = 'desactivar';
      this.successMessage = 'desactivado';
    } else {
      this.status = 'activar';
      this.successMessage = 'activado';
    }

    this.periodService.deletePeriod(id).subscribe(
      () => {
        this.message.success(`El periodo ${element.name} ha sido ${this.successMessage}`);
        element.active = !element.active;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];
        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al ' + this.status + ' el periodo.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
