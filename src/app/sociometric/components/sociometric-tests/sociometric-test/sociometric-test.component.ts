import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import lastDayOfYear from 'date-fns/lastDayOfYear';

import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { QuestionBank } from 'src/app/sociometric/shared/question-bank.model';
import { QuestionBankService } from 'src/app/sociometric/shared/question-bank.service';
import { Preset } from 'src/app/sociometric/shared/sociometric-test/preset.model';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';
import { Student } from 'src/app/students/shared/student.model';
import { PresetService } from 'src/app/sociometric/shared/sociometric-test/preset.service';

@Component({
  selector: 'app-sociometric-test',
  templateUrl: './sociometric-test.component.html',
  styleUrls: ['./sociometric-test.component.css']
})
export class SociometricTestComponent implements OnInit {
  loading = false;
  sociometricTest: SociometricTest;
  copyOfSociometricTest: SociometricTest;
  listOfColumn: {
    title: string;
    compare: unknown;
    priority: number;
  }[];

  // Update
  editing = false;
  btnLoading = false;
  sociometricTestForm!: FormGroup;

  // Presets
  preset: Preset;
  isVisible = false;
  presetForm!: FormGroup;
  isConfirmLoading = false;

  // Duration input.
  durationFormatter = (value: number): string => (value ? `${value} min` : '');
  durationParser = (value: string): string => value.replace(' min', '');

  // Filters
  shifts: {
    id: number;
    name: string;
    grades: { id: number; name: string; sections: ShiftPeriodGrade[] }[];
  }[] = [];
  grades: unknown[];
  sections: ShiftPeriodGrade[];
  questionBanks: QuestionBank[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private presetService: PresetService,
    private questionBankService: QuestionBankService,
    private sociometricTestService: SociometricTestService
  ) {}

  ngOnInit(): void {
    this.preset = new Preset();

    this.getSociometricTest();
    this.setTableSettings();
  }

  getSociometricTest(): void {
    this.route.paramMap.subscribe((params) => {
      const param: string = params.get('sociometrictest');
      let id: number;

      this.loading = true;

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        id = Number(param);
        console.log(id);
        this.sociometricTestService.getSociometricTest(id).subscribe(
          (data) => {
            this.loading = false;
            this.sociometricTest = data['data'];
            console.log(data);
            this.presetForm = this.fb.group({
              startedAt: [null, Validators.required],
              duration: [null, [Validators.required, Validators.min(15), Validators.max(120)]]
            });

            this.getCatalogs();
          },
          () => {
            this.loading = false;
            this.router.navigateByUrl('/pruebas-sociometrica/tests/' + param, {
              skipLocationChange: true
            });
          }
        );
      } else {
        this.loading = false;
        this.router.navigateByUrl('/pruebas-sociometrica/tests/' + param, { skipLocationChange: true });
      }
    });
  }

  setTableSettings(): void {
    this.listOfColumn = [
      {
        title: 'NIE',
        compare: (a: Student, b: Student) => a.code.localeCompare(b.code),
        priority: 1
      },
      {
        title: 'Nombre',
        compare: (a: Student, b: Student) => a.firstname.localeCompare(b.firstname),
        priority: 2
      },
      {
        title: 'Apellido',
        compare: (a: Student, b: Student) => a.lastname.localeCompare(b.lastname),
        priority: 3
      }
    ];
  }

  //#region Update
  setForm(): void {
    this.sociometricTestForm = this.fb.group({
      shift: [this.sociometricTest.shift.id, Validators.required],
      grade: [this.sociometricTest.grade.id, Validators.required],
      section: [this.sociometricTest.section.id, Validators.required],
      questionBank: [this.sociometricTest.questionBank.id, Validators.required],
      answersPerQuestion: [this.sociometricTest.answersPerQuestion, Validators.required]
    });

    this.updateSelectors('shift', this.sociometricTest.shift.id);
    this.updateSelectors('grade', this.sociometricTest.grade.id);

    this.sociometricTestForm.get('grade').setValue(this.sociometricTest.grade.id);
    this.sociometricTestForm.get('section').setValue(this.sociometricTest.section.id);
  }

  getCatalogs(): void {
    this.loading = true;
    this.questionBankService.mergeQuestionBanksAndCatalogs().subscribe((data) => {
      this.loading = false;

      const counselorAssignation = data['profile']['counselorAssignation'];
      this.questionBanks = data['questionBanks']['data'];

      if (counselorAssignation) {
        Object.values(counselorAssignation).forEach((assignation) => {
          const grades = new Array<{ id: number; name: string; sections: ShiftPeriodGrade[] }>();

          Object.values(assignation).forEach((assignation) => {
            assignation['gradeDetails'].forEach((grade) => {
              let sections = new Array<ShiftPeriodGrade>();

              grade.sectionDetails.forEach((section) => {
                sections.push(section.section);
              });

              sections = sections.sort((a, b) => a.id - b.id);
              sections = sections.filter((x) => x.name.length === 1).concat(sections.filter((x) => x.name.length > 1));
              grades.push({ id: grade.grade.id, name: grade.grade.name, sections: sections });
            });
          });

          this.shifts.push({ id: assignation[0]['shift'].id, name: assignation[0]['shift'].name, grades });
        });
      }
    });
  }

  updateSelectors(level: string, id: unknown): void {
    switch (level) {
      case 'shift':
        if (id) {
          const shift = this.shifts.filter((x) => x.id === id);
          this.grades = shift[0]['grades'];
        } else {
          this.grades = [];
          this.sociometricTestForm.get('grade').setValue(null);
        }
        this.sections = [];
        this.sociometricTestForm.get('section').setValue(null);
        break;

      case 'grade':
        if (id) {
          const shift = this.shifts.filter((x) => x.id === this.sociometricTestForm.controls['shift'].value);
          const grade = shift[0]['grades'].filter((x) => x.id === id);
          this.sections = grade[0]['sections'];
        } else {
          this.sections = [];
          this.sociometricTestForm.get('section').setValue(null);
        }
        break;
    }
  }

  submitForm(): void {
    for (const i in this.sociometricTestForm.controls) {
      this.sociometricTestForm.controls[i].markAsDirty();
      this.sociometricTestForm.controls[i].updateValueAndValidity();
    }

    if (this.sociometricTestForm.valid) {
      this.copyOfSociometricTest = new SociometricTest();

      this.copyOfSociometricTest.id = this.sociometricTest.id;
      this.copyOfSociometricTest.shift = new ShiftPeriodGrade();
      this.copyOfSociometricTest.grade = new ShiftPeriodGrade();
      this.copyOfSociometricTest.section = new ShiftPeriodGrade();
      this.copyOfSociometricTest.questionBank = new QuestionBank();

      // Sociometric test
      this.copyOfSociometricTest.shift.id = this.sociometricTestForm.controls['shift'].value;
      this.copyOfSociometricTest.grade.id = this.sociometricTestForm.controls['grade'].value;
      this.copyOfSociometricTest.section.id = this.sociometricTestForm.controls['section'].value;
      this.copyOfSociometricTest.questionBank.id = this.sociometricTestForm.controls['questionBank'].value;
      this.copyOfSociometricTest.answersPerQuestion = this.sociometricTestForm.controls['answersPerQuestion'].value;

      this.updateTest();
    }
  }

  updateTest(): void {
    this.btnLoading = true;
    this.sociometricTestService.updateSociometricTest(this.copyOfSociometricTest).subscribe(
      () => {
        this.btnLoading = false;
        this.editing = false;
        this.message.success(`La prueba sociométrica ha sido actualizada con éxito`);
        this.copyOfSociometricTest = new SociometricTest();
        this.sociometricTestForm.reset();
        this.getSociometricTest();
      },
      (error) => {
        this.btnLoading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];
        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al intentar actualizar la prueba sociométrica.',
            error.message,
            {
              nzDuration: 30000
            }
          );
        }
      }
    );
  }
  //#endregion

  //#region Presets
  openModal(preset: Preset): void {
    this.isVisible = true;

    if (preset) {
      this.preset = preset;

      this.presetForm.setValue({
        startedAt: preset.startedAt,
        duration: preset.duration
      });
    }
  }

  resetForm(): void {
    this.isVisible = false;
    this.preset = new Preset();
    this.presetForm.reset();
  }

  handleOk(): void {
    const startedAtControl = this.presetForm.controls['startedAt'];
    const durationControl = this.presetForm.controls['duration'];

    // Display errors if needed
    startedAtControl.markAsDirty();
    startedAtControl.updateValueAndValidity();

    durationControl.markAsDirty();
    durationControl.updateValueAndValidity();

    if (this.presetForm.valid) {
      this.preset.startedAt = this.presetForm.controls['startedAt'].value;
      this.preset.duration = this.presetForm.controls['duration'].value;

      this.preset.id ? this.updatePreset() : this.createPreset();
    }
  }

  createPreset(): void {
    this.isConfirmLoading = true;

    this.presetService.createPreset(this.sociometricTest.id, this.preset).subscribe(
      (data) => {
        this.isConfirmLoading = false;
        this.resetForm();

        this.sociometricTest.presets.push(data);
        this.message.success(`La prueba sociométrica ha sido programada con éxito`);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];
        this.isConfirmLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al programar la prueba sociométrica. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 30000 }
          );
        }
      }
    );
  }

  updatePreset(): void {
    this.isConfirmLoading = true;
    this.presetService.updatePreset(this.sociometricTest.id, this.preset).subscribe(
      (data) => {
        this.isConfirmLoading = false;
        this.resetForm();
        console.log(data);
        const id = this.sociometricTest.presets.findIndex((x) => x.id === this.preset.id)[0];
        this.sociometricTest.presets[id] = data;

        this.message.success(`La programación de la prueba sociométrica ha sido actualizada con éxito`);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];
        this.isConfirmLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al actualizar la programación la prueba sociométrica. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 30000 }
          );
        }
      }
    );
  }

  deletePreset(presetId: number): void {
    this.presetService.deletePreset(this.sociometricTest.id, presetId).subscribe(
      () => {
        this.sociometricTest.presets = this.sociometricTest.presets.filter((x) => x.id !== presetId);
        this.message.success(`La programación ha sido eliminada con éxito`);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];
        this.isConfirmLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al eliminar la programación de la prueba sociométrica. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 30000 }
          );
        }
      }
    );
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return (
      differenceInCalendarDays(current, new Date()) > 0 &&
      differenceInCalendarDays(current, lastDayOfYear(new Date())) > 0
    );
  };
  //#endregion
}
