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

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.css']
})
export class SchoolYearComponent implements OnInit {
  loading = false;
  previousSchoolYear: SchoolYear;
  schoolYear: SchoolYear;
  cacheSchoolYear: SchoolYear;
  catalogs: Catalogs;

  // No active or draft school year
  classPeriodForm!: FormGroup;
  confirmModal?: NzModalRef;

  // Draf school year
  currentStep = 1; // TODO: return value 0
  isValid = true;
  emptyCoordinators: { total: number; empty: number };

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
        this.cacheSchoolYear = JSON.parse(JSON.stringify(this.schoolYear));

        // this.schoolYear.status = 'En curso'; //TODO: Delete En curso, Nuevo

        // Catalogs
        this.catalogs.shifts = data['shifts']['data'].filter((x) => x.active === true).sort((a, b) => a.id - b.id);
        this.catalogs.cycles = data['cycles']['data'].sort((a, b) => a.id - b.id);
        this.catalogs.grades = data['grades']['data'].filter((x) => x.active === true);
        this.catalogs.sections = data['sections']['data']
          .filter((x) => x.name.length === 1)
          .concat(data['sections']['data'].filter((x) => x.name.length > 1));

        if (this.schoolYear.status === 'En proceso de apertura') {
          this.initializeShifts();
          this.initializeCycleCoordinators();
        }
        this.loading = false;
      },
      (error) => {
        if (error.status === 404) this.schoolYear.status = 'Nuevo';
        this.loading = false;
      }
    );
  }

  initializeShifts(): void {
    if (this.schoolYear.shifts.length === 0) {
      this.catalogs.shifts.forEach((shift) => {
        const _shift = this.previousSchoolYear.shifts.find((x) => x['shift']['id'] === shift.id);

        if (_shift) this.schoolYear.shifts.push(_shift);
        else {
          this.schoolYear.shifts.push({
            shift: { id: shift.id, name: shift.name, cycles: new Array<unknown>() }
          });
        }
      });

      this.cacheSchoolYear = JSON.parse(JSON.stringify(this.schoolYear));
    } else if (this.catalogs.shifts.length !== this.schoolYear.shifts.length) {
      this.catalogs.shifts.forEach((shift) => {
        const _shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === shift.id);

        if (!_shift) {
          this.schoolYear.shifts.push({ shift: { id: shift.id, name: shift.name, cycles: new Array<unknown>() } });
        }
      });

      this.cacheSchoolYear = JSON.parse(JSON.stringify(this.schoolYear));
    }
  }

  initializeCycleCoordinators(): void {
    this.checkEmptyCoordinators();

    if (this.emptyCoordinators['total'] === this.emptyCoordinators['empty']) {
      this.previousSchoolYear.shifts.forEach((shift) => {
        const _shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === shift['shift']['id']);
        shift['shift']['cycles'].forEach((cycle) => {
          const _cycle = _shift['shift']['cycles'].find((x) => x['cycle']['id'] === cycle['cycle']['id']);
          _cycle['cycleCoordinator'] = cycle['cycleCoordinator'];
          _cycle['cycleCoordinator']['fullname'] = cycle['cycleCoordinator']['firstname'].concat(
            ' ',
            cycle['cycleCoordinator']['lastname']
          );
        });
      });

      this.schoolYear.shifts[0]['shift']['cycles'][0]['cycle']['id'] = 74;
      this.schoolYear.shifts[0]['shift']['cycles'][0]['cycle']['fullname'] = 'Adaline Vardey';
    }
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
                  <p><i>Una vez iniciada la apertura del año escolar, el periodo dejará de ser accesible para mofidicaciones hasta que se completen todos los pasos.</i></p>`,
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
    let grade, actualCycle;
    const shift = this.schoolYear.shifts.filter((x) => x['shift']['id'] === content['shift']['id']);
    let newCycle = shift[0]['shift']['cycles'].find((x) => x['cycle']['id'] == content['field']);

    // Find grade
    for (let i = 0; i < shift[0]['shift']['cycles'].length; i++) {
      grade = shift[0]['shift']['cycles'][i]['gradeDetails'].find(
        (x) => x['grade']['id'] === content['data']['grade']['id']
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

          if (newCycle) newCycle['gradeDetails'].push(grade);
          else if (content['field']) {
            const findCycle = this.catalogs.cycles.find((x) => x.id === content['data']['cycle'].id);
            newCycle = {
              id: null,
              cycle: { ...findCycle },
              cycleCoordinator: new User(),
              gradeDetails: new Array<unknown>()
            };

            newCycle['gradeDetails'].push({
              counselor: new User(),
              grade: { ...content['data']['grade'] },
              sectionDetails: new Array<unknown>()
            });

            shift[0]['shift']['cycles'].push(newCycle);
          }
        } else {
          if (content['field'] && !newCycle) {
            const findCycle = this.catalogs.cycles.find((x) => x.id === content['data']['cycle'].id);
            newCycle = {
              id: null,
              cycle: { ...findCycle },
              cycleCoordinator: new User(),
              gradeDetails: new Array<unknown>()
            };
            shift[0]['shift']['cycles'].push(newCycle);
          }

          newCycle['gradeDetails'].push({
            counselor: new User(),
            grade: { ...content['data']['grade'] },
            sectionDetails: new Array<unknown>()
          });
        }
        // If the cycle doesn't have gradeDetails must be removed from the shift
        if (actualCycle && actualCycle['gradeDetails'].length === 0) {
          shift[0]['shift']['cycles'] = shift[0]['shift']['cycles'].filter(
            (x) => x['cycle'].id !== actualCycle['cycle'].id
          );
        }
        break;
      case 'section':
        let section;
        grade
          ? (section = grade['sectionDetails'].find((x) => x['section'].id === content['field']['id']))
          : (grade = { sectionDetails: new Array<unknown>() });

        section
          ? (grade['sectionDetails'] = grade['sectionDetails'].filter(
              (x) => x['section'].id !== content['field']['id']
            ))
          : grade['sectionDetails'].push({ id: null, section: { ...content['field'] }, teacher: new User() });
        break;
    }
  }

  updateCycleCoordinators(content: unknown): void {
    const shift = this.schoolYear.shifts.filter((x) => x['shift']['id'] === content['shift']['id']);
    const cycle = shift[0]['shift']['cycles'].find((x) => x['cycle'].id === content['cycle']['cycle']['id']);

    cycle['cycleCoordinator'] = content['cycle']['cycleCoordinator'];
    console.log(cycle['cycleCoordinator'], content['cycle']['cycleCoordinator']);
  }

  pre(): void {
    this.sendData(false);
  }

  next(): void {
    this.sendData(true);
  }

  done(): void {
    console.log('done');
  }

  sendData(next: boolean): void {
    switch (this.currentStep) {
      case 0:
        console.log('Ciclos, grados y secciones');
        this.academicAssignmentsStep(next);
        break;
      case 1:
        console.log('Coordinadores');
        this.cycleCoordinatorsStep(next);
        break;
      case 2:
        console.log('Titulares');
        break;
      case 3:
        console.log('Orientadores');
        break;
      case 4:
        console.log('Resumen');
        break;
    }
    // Current step direction will be setted in the api calls
  }

  academicAssignmentsStep(next: boolean): void {
    let emptyShifts = false;
    this.schoolYear.shifts.forEach((shift) => {
      if (!shift['shift']['cycles']) emptyShifts = true;
    });
    if (!emptyShifts) {
      if (JSON.stringify(this.schoolYear) !== JSON.stringify(this.cacheSchoolYear)) {
        this.loading = true;
        this.schoolYearService.saveAcademicAssignments(this.schoolYear).subscribe(
          () => {
            this.loading = false;
            this.message.success(`La asignación de ciclos, grados y secciones se ha guardado con éxito`);
            this.cacheSchoolYear = JSON.parse(JSON.stringify(this.schoolYear));
            if (next) this.currentStep += 1;
          },
          (error) => {
            const statusCode = error.statusCode;
            const notIn = [401, 403];
            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al guardar la asignación actual.', error.message, {
                nzDuration: 0
              });
            } else if (typeof error === 'string') {
              this.notification.create('error', 'Ocurrió un error al guardar la asignación actual.', error, {
                nzDuration: 0
              });
            }
            this.loading = false;
          }
        );
      } else {
        next ? (this.currentStep += 1) : (this.currentStep -= 1);
      }
    } else {
      this.notification.create(
        'error',
        'Uno o más turnos vacíos.',
        'Debe asignar al menos un grado a algún ciclo para poder continuar',
        {
          nzDuration: 15000
        }
      );
    }
  }

  cycleCoordinatorsStep(next: boolean): void {
    // Find empty coordinators, and comunicated to the children
    console.log(this.isValid);
    this.isValid = false;
    console.log(this.isValid);
    // next ? (this.currentStep += 1) : (this.currentStep -= 1);
  }

  checkEmptyCoordinators(): void {
    this.emptyCoordinators = { total: 0, empty: 0 };

    this.schoolYear.shifts.forEach((shift) => {
      shift['shift']['cycles'].forEach((cycle) => {
        this.emptyCoordinators['total']++;
        if (!cycle['cycleCoordinator']) this.emptyCoordinators['empty']++;
      });
    });
  }
  //#endregion
}
