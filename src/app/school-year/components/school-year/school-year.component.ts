import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { es } from 'date-fns/locale';
import { format, formatDistanceStrict } from 'date-fns';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

import { SchoolYear } from './../../shared/school-year.model';
import { SchoolYearService } from '../../shared/school-year.service';
import { Catalogs } from '../../shared/catalogs.model';
import { User } from 'src/app/logs/shared/user-log.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.css']
})
export class SchoolYearComponent implements OnInit {
  loading = false;
  previousSchoolYear: SchoolYear;
  schoolYear: SchoolYear;
  catalogs: Catalogs;

  // No active or draft school year
  classPeriodForm!: FormGroup;
  confirmModal?: NzModalRef;

  // Draf school year
  currentStep = 0;

  constructor(
    private fb: FormBuilder,
    private schoolYearService: SchoolYearService,
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.schoolYear = new SchoolYear();
    this.catalogs = new Catalogs();
    this.initClassPeriod();
    this.getSchoolYear();
  }

  getSchoolYear(): void {
    this.loading = true;
    this.schoolYearService.mergeSchoolYearAndCatalogs().subscribe(
      (data) => {
        // Previous School Year
        this.previousSchoolYear = data['schoolYear'][1];

        // School Year
        this.schoolYear = data['schoolYear'][0];
        // this.schoolYear.status = 'En curso'; //TODO: Delete En curso, Nuevo

        // Catalogs
        this.catalogs.shifts = data['shifts']['data'].filter((x) => x.active === true).sort((a, b) => a.id - b.id);
        this.catalogs.cycles = data['cycles']['data'].sort((a, b) => a.id - b.id);
        this.catalogs.grades = data['grades']['data'].filter((x) => x.active === true);
        this.catalogs.sections = data['sections']['data']
          .filter((x) => x.name.length === 1)
          .concat(data['sections']['data'].filter((x) => x.name.length > 1));

        this.loading = false;
      },
      (error) => {
        if (error.status === 404) this.schoolYear.status = 'Nuevo';
        this.loading = false;
      }
    );
  }

  //#region New school year
  initClassPeriod(): void {
    this.classPeriodForm = this.fb.group({
      classPeriod: ['', [Validators.required]]
    });
  }

  submitClassPeriod(): void {
    for (const i in this.classPeriodForm.controls) {
      this.classPeriodForm.controls[i].markAsDirty();
      this.classPeriodForm.controls[i].updateValueAndValidity();
    }

    if (this.classPeriodForm.valid) {
      const period = this.classPeriodForm.controls['classPeriod'].value;

      const result = formatDistanceStrict(period[0], period[1], { locale: es });
      this.showStartConfirm(period, result);
    }
  }

  showStartConfirm(period: Date[], distance: string): void {
    const startFormat = format(period[0], 'd/MMMM/yyyy', { locale: es });
    const endFormat = format(period[1], 'd/MMMM/yyyy', { locale: es });

    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea aperturar el año escolar?`,
      nzContent: `<p class="principal">DETALLES</p> 
                  <p><b>Periodo:</b> ${startFormat} a ${endFormat}</p> 
                  <p><b>Duración:</b> ${distance}</p><br>
                  <p><i>Una vez iniciada la apartura del año escolar, el periodo dejará de ser accesible para mofidicaciones hasta que se completen todos los pasos.</i></p>`,
      nzOnOk: () =>
        this.schoolYearService
          .initializeSchoolYear(period[0], period[1])
          .toPromise()
          .then((r) => {
            this.message.success(`El año escolar ${r['year']} se ha aperturado con éxito`);
            this.getSchoolYear();
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al intentar aperturar el año escolar.', err.message, {
                nzDuration: 0
              });
            }
          })
    });
  }
  //#endregion

  //#region Draf school year
  updateItem(content: unknown): void {
    console.log(content);
    let grade, actualCycle;
    // Get shift
    let shift = this.schoolYear.shifts.filter((x) => x['shift']['id'] === content['shift']['id']);

    if (shift.length == 0) {
      const prev = this.previousSchoolYear.shifts.filter((x) => x['shift']['id'] === content['shift']);
      shift = prev;
      this.schoolYear.shifts.push(prev);
    }

    const newCycle = shift[0]['shift']['cycles'].find((x) => x['cycle']['id'] == content['field']);

    // Find grade
    for (let i = 0; i < shift[0]['shift']['cycles'].length; i++) {
      grade = shift[0]['shift']['cycles'][i]['gradeDetails'].find(
        (x) => x['grade']['id'] == content['data']['grade']['id']
      );

      if (grade) {
        actualCycle = shift[0]['shift']['cycles'][i];
        break;
      }
    }

    switch (content['type']) {
      case 'cycle':
        if (grade) {
          actualCycle['gradeDetails'] = actualCycle['gradeDetails'].filter(
            (x) => x['grade']['id'] != content['data']['grade']['id']
          );
          newCycle['gradeDetails'].push(grade);
        } else {
          newCycle['gradeDetails'].push({
            counselor: new User(),
            grade: content['data']['grade'],
            sectionDetails: new Array<unknown>()
          });
        }
        break;
      case 'section':
        grade['sectionDetails'] = content['data']['sections'];
        break;
    }
  }

  pre(): void {
    this.currentStep -= 1;
  }

  next(): void {
    this.currentStep += 1;
  }

  done(): void {
    console.log('done');
  }
  //#endregion
}
