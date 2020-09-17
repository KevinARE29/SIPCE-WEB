/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { es } from 'date-fns/locale';
import { format, formatDistanceStrict, getYear, parseISO } from 'date-fns';
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
  catalogs: Catalogs;

  // No active or draft school year
  classPeriodForm!: FormGroup;
  confirmModal?: NzModalRef;

  // Draf school year
  currentStep = 0;

  // School year
  emptyUsers: { total: number; empty: number; valid: boolean };

  // Open school year
  confirmSchoolYearModal?: NzModalRef;

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

    this.emptyUsers = { total: 0, empty: 0, valid: true };
  }

  getSchoolYear(): void {
    this.loading = true;
    this.schoolYearService.mergeSchoolYearAndCatalogs().subscribe(
      (data) => {
        // Previous School Year
        this.previousSchoolYear = data['schoolYear'][1];

        // School Year
        this.schoolYear = data['schoolYear'][0];

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
          this.initializeHeadTeachers();
          this.initializeCounselors();
        }
        this.loading = false;
      },
      (error) => {
        if (error.status === 404) this.schoolYear.status = 'Histórico';
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
    } else if (this.catalogs.shifts.length !== this.schoolYear.shifts.length) {
      this.catalogs.shifts.forEach((shift) => {
        const _shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === shift.id);

        if (!_shift) {
          this.schoolYear.shifts.push({ shift: { id: shift.id, name: shift.name, cycles: new Array<unknown>() } });
        }
      });
    }
  }

  initializeCycleCoordinators(): void {
    this.checkEmptyCoordinators();

    if (this.emptyUsers['total'] === this.emptyUsers['empty']) {
      this.previousSchoolYear.shifts.forEach((shift) => {
        const _shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === shift['shift']['id']);
        shift['shift']['cycles'].forEach((cycle) => {
          const _cycle = _shift['shift']['cycles'].find((x) => x['cycle']['id'] === cycle['cycle']['id']);
          _cycle['cycleCoordinator'] = cycle['cycleCoordinator'];
          _cycle['cycleCoordinator']['fullname'] = cycle['cycleCoordinator']['firstname'].concat(
            ' ',
            cycle['cycleCoordinator']['lastname']
          );
          _cycle['cycleCoordinator']['isValid'] = true;
        });
      });
    }
  }

  initializeHeadTeachers(): void {
    this.checkEmptyHeadTeachers();

    if (this.emptyUsers['total'] === this.emptyUsers['empty']) {
      this.previousSchoolYear.shifts.forEach((shift) => {
        const _shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === shift['shift']['id']);

        shift['shift']['cycles'].forEach((cycle) => {
          const _cycle = _shift['shift']['cycles'].find((x) => x['cycle']['id'] === cycle['cycle']['id']);

          cycle['gradeDetails'].forEach((grade) => {
            const _grade = _cycle['gradeDetails'].find((x) => x['grade']['id'] === grade['grade']['id']);

            grade['sectionDetails'].forEach((section) => {
              let _section;
              if (_grade) {
                _section = _grade['sectionDetails'].find((x) => x['section']['id'] === section['section']['id']);
                _section['teacher'] = section['teacher'];
                _section['teacher']['fullname'] = section['teacher']['firstname'].concat(
                  ' ',
                  section['teacher']['lastname']
                );
                _section['teacher']['isValid'] = true;
              } else if (section) {
                _section['teacher'] = new User();
                _section['teacher']['isValid'] = true;
              }
            });
          });
        });
      });
    }
  }

  initializeCounselors(): void {
    this.checkEmptyCounselors();
    
    if (this.emptyUsers['total'] === this.emptyUsers['empty']) {
      this.previousSchoolYear.shifts.forEach((shift) => {
        const _shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === shift['shift']['id']);

        shift['shift']['cycles'].forEach((cycle) => {
          const _cycle = _shift['shift']['cycles'].find((x) => x['cycle']['id'] === cycle['cycle']['id']);

          cycle['gradeDetails'].forEach((grade) => {
            const _grade = _cycle['gradeDetails'].find((x) => x['grade']['id'] === grade['grade']['id']);

            if (_grade) {
              _grade['counselor'] = grade['counselor'];
              _grade['counselor']['fullname'] = grade['counselor']['firstname'].concat(
                ' ',
                grade['counselor']['lastname']
              );
              grade['counselor']['isValid'] = true;
            }

          });
        });
      });
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

  //#region School year
  //#region Update school year
  updateItem(content: unknown): void {
    let grade, actualCycle;
    const shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === content['shift']['id']);
    let newCycle = shift['shift']['cycles'].find((x) => x['cycle']['id'] == content['field']);

    // Find grade
    for (let i = 0; i < shift['shift']['cycles'].length; i++) {
      grade = shift['shift']['cycles'][i]['gradeDetails'].find(
        (x) => x['grade']['id'] === content['data']['grade']['id']
      );

      if (grade) {
        actualCycle = shift['shift']['cycles'][i];
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

            shift['shift']['cycles'].push(newCycle);
          } else if (actualCycle) {
            if (!actualCycle['gradeDetails'].length) {
              shift['shift']['cycles'] = shift['shift']['cycles'].filter((x) => x['cycle']['id'] !== actualCycle['cycle'].id);
            }
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
            shift['shift']['cycles'].push(newCycle);
          }

          newCycle['gradeDetails'].push({
            counselor: new User(),
            grade: { ...content['data']['grade'] },
            sectionDetails: new Array<unknown>()
          });
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
    const shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === content['shift']['id']);
    const cycle = shift['shift']['cycles'].find((x) => x['cycle'].id === content['cycle']['cycle']['id']);

    cycle['cycleCoordinator'] = content['cycle']['cycleCoordinator']
      ? content['cycle']['cycleCoordinator']
      : new User();

    cycle['cycleCoordinator']['isValid'] = !content['cycle']['error'];
    if (!cycle['cycleCoordinator']['id']) cycle['cycleCoordinator']['isValid'] = false;
  }

  updateHeadTeachers(content: unknown): void {
    const shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === content['shift']['id']);
    const cycle = shift['shift']['cycles'].find((x) => x['cycle'].id === content['grade']['cycle']['id']);
    const grade = cycle['gradeDetails'].find((x) => x['grade'].id === content['grade']['grade']['id']);
    const section = grade['sectionDetails'].find((x) => x['section'].id === content['section']['section']['id']);

    section['teacher'] = content['section']['teacher'] ? content['section']['teacher'] : new User();

    section['teacher']['isValid'] = !content['section']['error'];
    if (!section['teacher']['id']) section['teacher']['isValid'] = false;
  }

  updateCounselors(content: unknown): void {
    const shift = this.schoolYear.shifts.find((x) => x['shift']['id'] === content['shift']['id']);
    const cycles = shift['shift']['cycles'];

    if (!content['remove']) {
      // Assign counselor to the respective grades
      content['counselor']['grades'].forEach((gr) => {
        for (const c in cycles) {
          const cycle = cycles[c];
          let found = false;

          for (const g in cycle['gradeDetails']) {
            const grade = cycle['gradeDetails'][g];

            if(grade['grade'].id === gr.id) {
              grade['counselor'] = content['counselor'];
              found = true;

              break;
            }
          }

          if(found) break;
        }
      });
    } else {
      // Remove counselor from grade
      for (const c in cycles) {
        const cycle = cycles[c];
        let found = false;

        for (const g in cycle['gradeDetails']) {
          const grade = cycle['gradeDetails'][g];

          if(grade['grade'].id === content['remove']['id']) {
            grade['counselor'] = null;
            found = true;

            break;
          }
        }

        if(found) break;
      }
      
    }
  }
  //#endregion

  //#region Steps
  pre(): void {
    this.sendData(false);
  }

  next(): void {
    this.sendData(true);
  }

  done(): void {
    const year = getYear(parseISO(this.schoolYear.startDate.toString()));
    let allowFinalStep = true;
    let errorMessage = '';

    this.checkEmptyCoordinators();
    if (this.emptyUsers.empty > 0 && this.emptyUsers.valid) {
      allowFinalStep = false; 
      errorMessage += 'Se detectaron ciclos sin coordinadores asignados. ';
    } 

    this.checkEmptyHeadTeachers();
    if (this.emptyUsers.empty > 0 && this.emptyUsers.valid) {
      allowFinalStep = false; 
      errorMessage += 'Se detectaron grados sin docentes titulares asignados. ';
    } 

    this.checkEmptyCounselors();
    if (this.emptyUsers.empty > 0 && this.emptyUsers.valid) {
      allowFinalStep = false; 
      errorMessage += 'Se detectaron grados sin orientadores asignados. ';
    } 

    if (allowFinalStep) {
      this.confirmSchoolYearModal = this.modal.confirm({
        nzTitle: `¿Aperturar año escolar ${year}?`,
        nzContent: 'Al dar clic al botón Aceptar se iniciará un nuevo año escolar con las configuraciones asignadas.',
        nzOnOk: () =>
          this.schoolYearService
            .startSchoolYear()
            .toPromise()
            .then(() => {
              this.message.success(`El año escolar ${year} se ha iniciado con éxito`);
              this.getSchoolYear();
            })
            .catch((err) => {
              const statusCode = err.statusCode;
              const notIn = [401, 403];
  
              if (!notIn.includes(statusCode) && statusCode < 500) {
                this.notification.create('error', 'Ocurrió un error al aperturar el año escolar.', err.message, {
                  nzDuration: 0
                });
              }
            })
      });
    } else {
      this.notification.create('error', 'Ocurrió un error al aperturar el año escolar. Verifique lo siguiente: ', errorMessage, {
        nzDuration: 0
      });
    }
  }

  // Save data
  sendData(next: boolean): void {
    switch (this.currentStep) {
      case 0:
        this.academicAssignmentsStep(next);
        break;
      case 1:
        this.cycleCoordinatorsStep(next);
        break;
      case 2:
        this.headTeachersStep(next);
        break;
      case 3:
        this.counselorsStep(next);
        break;
      case 4:
        this.finalStep(next);
        break;
    }
  }
  //#endregion 

  academicAssignmentsStep(next: boolean): void {
    let emptyShifts = false;
    this.schoolYear.shifts.forEach((shift) => {
      if (!shift['shift']['cycles']) emptyShifts = true;
    });
    if (!emptyShifts) {
      this.loading = true;
      this.schoolYearService.saveAcademicAssignments(this.schoolYear).subscribe(
        () => {
          this.schoolYear['shifts'].forEach((shift) => {
            shift['shift']['cycles'].forEach((cycle) => {
              if (cycle['gradeDetails'].length === 0) {
                shift['shift']['cycles'] = shift['shift']['cycles'].filter(
                  (x) => x['cycle'].id !== cycle['cycle'].id
                );
              }
            });
          });

          this.loading = false;
          this.message.success(`La asignación de ciclos, grados y secciones se ha guardado con éxito`);
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
    this.checkEmptyCoordinators();
    if (this.emptyUsers['empty'] > 0 && this.emptyUsers['valid']) this.emptyUsers['valid'] = false;

    if (this.emptyUsers['valid']) {
      this.loading = true;
      this.schoolYearService.saveCycleCoordinators(this.schoolYear).subscribe(
        () => {
          this.loading = false;
          this.message.success(`La asignación de coordinadores se ha guardado con éxito`);
          next ? (this.currentStep += 1) : (this.currentStep -= 1);
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
      this.notification.create(
        'error',
        'Error en la asignación de coordinadores.',
        'Verifique que los valores ingresados en todos los turnos son correctos, no se permiten campos vacíos.',
        {
          nzDuration: 15000
        }
      );
    }
  }

  headTeachersStep(next: boolean): void {
    this.checkEmptyHeadTeachers();
    if (this.emptyUsers['empty'] > 0 && this.emptyUsers['valid']) this.emptyUsers['valid'] = false;

    if (this.emptyUsers['valid']) {
      this.loading = true;
      this.schoolYearService.saveHeadteachers(this.schoolYear).subscribe(
        () => {
          this.loading = false;
          this.message.success(`La asignación de docentes titulares se ha guardado con éxito`);
          next ? (this.currentStep += 1) : (this.currentStep -= 1);
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
      this.notification.create(
        'error',
        'Error en la asignación de docentes titulares.',
        'Verifique que los valores ingresados en todos los turnos son correctos, no se permiten campos vacíos.',
        {
          nzDuration: 15000
        }
      );
    }
  }

  counselorsStep(next: boolean): void {
    this.checkEmptyCounselors();
    if (this.emptyUsers['empty'] > 0 && this.emptyUsers['valid']) this.emptyUsers['valid'] = false;

    if (this.emptyUsers['valid']) {
      this.loading = true;
      this.schoolYearService.saveCounselors(this.schoolYear).subscribe(
        () => {
          this.loading = false;
          this.message.success(`La asignación de orientadores se ha guardado con éxito`);
          next ? (this.currentStep += 1) : (this.currentStep -= 1);
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
      this.notification.create(
        'error',
        'Error en la asignación de orientadores.',
        'Verifique que todos los grados hayan sido asignados a las orientadoras en todos los turnos.',
        {
          nzDuration: 15000
        }
      );
    }
  }

  finalStep(next: boolean): void {
    next ? (this.currentStep += 1) : (this.currentStep -= 1);
  }

  // Check school year elements
  checkEmptyCoordinators(): void {
    this.emptyUsers = { total: 0, empty: 0, valid: true };

    this.schoolYear.shifts.forEach((shift) => {
      shift['shift']['cycles'].forEach((cycle) => {
        this.emptyUsers['total']++;

        if (!cycle['cycleCoordinator'] || !cycle['cycleCoordinator'].id) this.emptyUsers['empty']++;
        if (cycle['cycleCoordinator'] && cycle['cycleCoordinator']['isValid'] === false)
          this.emptyUsers['valid'] = false;
      });
    });
  }

  checkEmptyHeadTeachers(): void {
    this.emptyUsers = { total: 0, empty: 0, valid: true };

    this.schoolYear.shifts.forEach((shift) => {
      shift['shift']['cycles'].forEach((cycle) => {
        cycle['gradeDetails'].forEach((grade) => {
          grade['sectionDetails'].forEach((section) => {
            this.emptyUsers['total']++;

            if (!section['teacher'] || !section['teacher'].id) this.emptyUsers['empty']++;
            if (section['teacher'] && section['teacher']['isValid'] === false)
              this.emptyUsers['valid'] = false;
          });
        });
      });
    });
  }

  checkEmptyCounselors(): void {
    this.emptyUsers = { total: 0, empty: 0, valid: true };

    this.schoolYear.shifts.forEach((shift) => {
      shift['shift']['cycles'].forEach((cycle) => {
        cycle['gradeDetails'].forEach((grade) => {
          this.emptyUsers['total']++;
          
          if (!grade['counselor'] || !grade['counselor'].id) this.emptyUsers['empty']++;
          if (grade['counselor'] && grade['counselor']['isValid'] === false)
              this.emptyUsers['valid'] = false;
        });
      });
    });
  }
  //#endregion
}
