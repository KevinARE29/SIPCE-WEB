import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GradeService } from '../../shared/grade.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Pagination } from './../../../shared/pagination.model';
import { ShiftPeriodGrade } from '../../shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-show-grades',
  templateUrl: './show-grades.component.html',
  styleUrls: ['./show-grades.component.css']
})
export class ShowGradesComponent implements OnInit {
  grades: ShiftPeriodGrade[];
  allGrades: ShiftPeriodGrade[];
  pagination: Pagination;
  loading = false;
  status: string;
  successMessage: string;
  warningMessage: string;
  listOfDisplayData: ShiftPeriodGrade[];
  tableSize = 'small';
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
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.enabled = false;
  }

  /* Deactivate/activate grade confirm modal */
  showConfirm(id: number): void {
    // cleanning variables
    this.inactiveCounter = 0;
    // setting the values of the select grade object
    const element = this.grades.find((x) => x.id === id);
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
      this.gradeService.deleteGrade(id).subscribe(
        () => {
          this.message.success(`El grado ${element.name} ha sido ${this.successMessage}`);
          element.active = !element.active;
          this.getGrades(); //getting the new json of all grades with updated status
        },
        (err) => {
          const statusCode = err.statusCode;
          const notIn = [401, 403];
          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create('error', 'Ocurrió un error al ' + this.status + ' el grado.', err.message, {
              nzDuration: 0
            });
          }
        }
      );
    } else {
      // message to show when the grade cannot be activated or deactivated
      this.notification.create(
        'error',
        'Ocurrio un error al ' + this.status + ' el grado:',
        'El grado actual no puede ser ' +
          this.successMessage +
          ' ya que los grados deben activarse o desactivarse secuencialmente'
      );
    }
  }

  getGrades(): void {
    this.gradeService.getGrades().subscribe(
      (data) => {
        this.allGrades = data['data'];
      },
      () => {
        //if an error occurs when obtaining all the degrees, the degree validations will be carried out from the backend
        this.enabled = true;
      }
    );
  }

  /* ---     sort method      --- */
  recharge(params: NzTableQueryParams): void {
    // getting all the grades
    this.loading = true;
    this.getGrades();

    //getting the grades paginated
    this.gradeService.searchGrade(params, params.pageIndex !== this.pagination.page).subscribe(
      (data) => {
        this.grades = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.grades];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los grados.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
