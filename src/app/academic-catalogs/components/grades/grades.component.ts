import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { GradeService } from '../../shared/grade.service';
import { ShiftPeriodGrade } from '../../shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  allGrades: ShiftPeriodGrade[];
  loading = false;
  status: string;
  successMessage: string;
  warningMessage: string;
  confirmModal?: NzModalRef;
  nextGrade: ShiftPeriodGrade;
  previusGrade: ShiftPeriodGrade;
  enabled: boolean; //variable that decide if the grade can be activated or deactivated
  inactiveCounter: number;

  constructor(
    private gradeService: GradeService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.enabled = false;
    this.getGrades();
  }

  /* Deactivate/activate grade confirm modal */
  showConfirm(id: number): void {
    // cleanning variables
    this.inactiveCounter = 0;
    // setting the values of the select grade object
    const element = this.allGrades.find((x) => x.id === id);
    const idCurrentGrade = element.id;
    //setting the values for the messages
    if (element.active === true) {
      this.status = 'desactivar';
      this.successMessage = 'desactivado';
    } else {
      this.status = 'activar';
      this.successMessage = 'activado';
    }

    // setting the status to the previous and next grade variables
    if (element.id === 15) {
      this.previusGrade = this.allGrades[idCurrentGrade - 1];
    } else if (element.id === 1) {
      this.nextGrade = this.allGrades[idCurrentGrade];
    } else {
      this.nextGrade = this.allGrades[idCurrentGrade - 2];
      this.previusGrade = this.allGrades[idCurrentGrade];
    }

    // total grades inactive
    for (let i = 0; i < this.allGrades.length; i++) {
      if (this.allGrades[i].active === false) {
        this.inactiveCounter++;
      }
    }

    // the grade with id 1 can activate and deactivate directly if every grade is deactivated
    if (element.id === 1) {
      if (this.inactiveCounter === 15) {
        this.enabled = true;
      } else {
        if (element.active == false || element.active === true) {
          if (this.nextGrade.active === true) {
            this.enabled = true;
          } else {
            this.enabled = false;
          }
        }
      }
    } else if (element.id === 15) {
      // when the grade with id 15 wants to change status,it must satisfy the next conditions
      if (element.active == false || element.active === true) {
        if (this.previusGrade.active === true) {
          //the grade can be deactivated or activated
          this.enabled = true;
        } else {
          this.enabled = false;
        }
      }
    } else {
      if (this.inactiveCounter === 15) {
        this.enabled = true;
      } else {
        //when a grade in the middle wants to deactivate
        if (element.active === true) {
          if (this.previusGrade.active === true && this.nextGrade.active === true) {
            this.enabled = false;
          } else {
            this.enabled = true;
          }
        } else {
          // when a grade in the middle wants to activate
          if (this.previusGrade.active === false && this.nextGrade.active === false) {
            this.enabled = false;
          } else {
            this.enabled = true;
          }
        }
      }
    }

    // consuming the route if the change of status is valid
    if (this.enabled) {
      this.loading = true;
      this.gradeService.toggleGradeStatus(id).subscribe(
        () => {
          this.message.success(`El grado ${element.name} ha sido ${this.successMessage}`);
          element.active = !element.active;

          this.loading = false;
        },
        (err) => {
          const statusCode = err.statusCode;
          const notIn = [401, 403];
          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create('error', 'Ocurrió un error al ' + this.status + ' el grado.', err.message, {
              nzDuration: 30000
            });
          }

          this.loading = false;
        }
      );
    } else {
      // message to show when the grade cannot be activated or deactivated
      this.notification.create(
        'error',
        'Ocurrió un error al ' + this.status + ' el grado:',
        'El grado actual no puede ser ' +
          this.successMessage +
          ' ya que los grados deben activarse o desactivarse secuencialmente.'
      );
    }
  }

  getGrades(): void {
    this.loading = true;
    this.gradeService.getAllGrades().subscribe((data) => {
      this.allGrades = data['data'];
      this.loading = false;
    });
  }
}
