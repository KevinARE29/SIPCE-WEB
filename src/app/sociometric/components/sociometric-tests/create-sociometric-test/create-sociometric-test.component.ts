import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { QuestionBank } from 'src/app/sociometric/shared/question-bank.model';
import { QuestionBankService } from 'src/app/sociometric/shared/question-bank.service';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';

@Component({
  selector: 'app-create-sociometric-test',
  templateUrl: './create-sociometric-test.component.html',
  styleUrls: ['./create-sociometric-test.component.css']
})
export class CreateSociometricTestComponent implements OnInit {
  loading = false;
  btnLoading = false;
  sociometricTestForm!: FormGroup;
  sociometricTest: SociometricTest;

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
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    private sociometricTestService: SociometricTestService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.init();

    this.sociometricTestForm = this.fb.group({
      shift: [null, Validators.required],
      grade: [null, Validators.required],
      section: [null, Validators.required],
      questionBank: [null, Validators.required],
      answersPerQuestion: [null, Validators.required]
    });
  }

  init(): void {
    this.loading = true;
    this.questionBankService.mergeQuestionBanksAndCatalogs().subscribe((data) => {
      this.loading = false;

      const counselorAssignation = data['profile']['counselorAssignation'];
      this.questionBanks = data['questionBanks']['data'];

      if (counselorAssignation) {
        Object.values(counselorAssignation).forEach((assignation) => {
          const grades = new Array<{ id: number; name: string; sections: ShiftPeriodGrade[] }>();
          assignation[0]['gradeDetails'].forEach((grade) => {
            let sections = new Array<ShiftPeriodGrade>();

            grade.sectionDetails.forEach((section) => {
              sections.push(section.section);
            });

            sections = sections.sort((a, b) => a.id - b.id);
            sections = sections.filter((x) => x.name.length === 1).concat(sections.filter((x) => x.name.length > 1));
            grades.push({ id: grade.grade.id, name: grade.grade.name, sections: sections });
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
      this.sociometricTest = new SociometricTest();
      this.sociometricTest.shift = new ShiftPeriodGrade();
      this.sociometricTest.grade = new ShiftPeriodGrade();
      this.sociometricTest.section = new ShiftPeriodGrade();
      this.sociometricTest.questionBank = new QuestionBank();

      // Sociometric test
      this.sociometricTest.shift.id = this.sociometricTestForm.controls['shift'].value;
      this.sociometricTest.grade.id = this.sociometricTestForm.controls['grade'].value;
      this.sociometricTest.section.id = this.sociometricTestForm.controls['section'].value;
      this.sociometricTest.questionBank.id = this.sociometricTestForm.controls['questionBank'].value;
      this.sociometricTest.answersPerQuestion = this.sociometricTestForm.controls['answersPerQuestion'].value;

      this.createTest();
    }
  }

  createTest(): void {
    this.btnLoading = true;

    this.sociometricTestService.createSociometricTest(this.sociometricTest).subscribe(
      () => {
        this.btnLoading = false;

        this.message.success(`La prueba sociométrica ha sido creada con éxito`);
        this.sociometricTestForm.reset();
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al intentar crear la prueba sociométrica.',
            error.message,
            {
              nzDuration: 30000
            }
          );
        }
      }
    );
  }
}
