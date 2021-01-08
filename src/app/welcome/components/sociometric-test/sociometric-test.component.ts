import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Question } from 'src/app/sociometric/shared/sociometric-test/question.model';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { StudentSociometricTestService } from 'src/app/sociometric/shared/sociometric-test/student-sociometric-test.service';
import { Student } from 'src/app/students/shared/student.model';

@Component({
  selector: 'app-sociometric-test',
  templateUrl: './sociometric-test.component.html',
  styleUrls: ['./sociometric-test.component.css']
})
export class SociometricTestComponent implements OnInit {
  testInProgress = false;
  loading = false;

  // Form
  btnLoading = false;
  passwordVisible = false;
  studentTestForm: FormGroup;

  // Test
  questions: Question[];
  currentQuestion: Question;
  currentIndex = 0;
  emptyPosition = true;
  test: { id: number; finished: boolean; sociometricTest: SociometricTest; student: Student; students: Student[] };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private studentSociometricTestService: StudentSociometricTestService
  ) {}

  ngOnInit(): void {
    const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    this.questions = new Array<Question>();

    this.studentTestForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(emailPattern)]],
      password: [null, Validators.required]
    });
  }

  access(): void {
    this.btnLoading = true;
    this.studentSociometricTestService.getStudentTest(this.studentTestForm.value).subscribe(
      (data) => {
        this.btnLoading = false;

        if (!data['data']['finished']) {
          this.testInProgress = true;

          this.test = data['data'];
          this.questions = data['questions'];

          this.test.students = this.test.students.filter((x) => x.id !== this.test.student.id);
          this.checkSeleted();
        } else {
          this.notification.create('error', 'Acceso denegado', `Ya has respondido a la prueba sociométrica`, {
            nzDuration: 30000
          });
        }
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403, 422];
        this.btnLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ingreso fallido.', 'Comprueba que los datos ingresados sean correctos.', {
            nzDuration: 30000
          });
        } else if (statusCode === 422) {
          this.notification.create('error', 'Ingreso fallido.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  checkSeleted(): void {
    this.questions.forEach((question) => {
      question.students = JSON.parse(JSON.stringify(this.test.students));
    });

    this.currentQuestion = this.questions[this.currentIndex];
    this.questions[this.currentIndex].status = 'Current';
  }

  checkPositions(): boolean {
    for (let i = 0; i < this.test.sociometricTest.answersPerQuestion; i++) {
      const pos = i + 1;
      const studentPositionI = this.currentQuestion.students.find((x) => x.position == pos);
      if (!studentPositionI) {
        return false;
      }
    }
    return true;
  }

  prev(): void {
    if (this.checkPositions()) {
      this.saveResponse(false);
    } else {
      this.notification.create(
        'error',
        'Respuesta incompleta',
        `Debes seleccionar ${this.test.sociometricTest.answersPerQuestion} estudiantes`,
        {
          nzDuration: 3000
        }
      );
    }
  }

  next(): void {
    if (this.checkPositions()) {
      this.saveResponse(true);
    } else {
      this.notification.create(
        'error',
        'Respuesta incompleta',
        `Debes seleccionar ${this.test.sociometricTest.answersPerQuestion} estudiantes`,
        {
          nzDuration: 3000
        }
      );
    }
  }

  done(): void {
    if (this.checkPositions()) {
      this.saveResponse(null);
    } else {
      this.notification.create(
        'error',
        'Respuesta incompleta',
        `Debes seleccionar ${this.test.sociometricTest.answersPerQuestion} estudiantes`,
        {
          nzDuration: 3000
        }
      );
    }
  }

  saveResponse(next: boolean): void {
    this.loading = true;

    this.studentSociometricTestService.saveResponse(this.currentQuestion, this.test).subscribe(
      () => {
        this.currentQuestion.status = 'Completed';
        switch (next) {
          case true:
            this.currentIndex++;
            this.currentQuestion = this.questions[this.currentIndex];
            this.questions[this.currentIndex].status = 'Current';

            this.loading = false;
            break;
          case false:
            this.currentIndex--;
            this.currentQuestion = this.questions[this.currentIndex];
            this.questions[this.currentIndex].status = 'Current';

            this.loading = false;
            break;
          default:
            this.completeTest();
            break;
        }
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        this.loading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al guardar la respuesta. Por favor verifica lo siguiente:',
            error.message,
            { nzDuration: 3000 }
          );
        }
      }
    );
  }

  completeTest(): void {
    this.studentSociometricTestService.completeTest(this.test).subscribe(() => {
      this.notification.create('success', 'Prueba sociométrica finalizada', '', { nzDuration: 30000 });
      this.loading = false;
      this.router.navigateByUrl(`/`);
    });
  }

  selectStudent(student: Student): void {
    for (let i = 0; i < this.test.sociometricTest.answersPerQuestion; i++) {
      const pos = i + 1;
      const studentPositionI = this.currentQuestion.students.find((x) => x.position == pos);

      if (studentPositionI && studentPositionI.id === student.id) {
        studentPositionI.position = 0;
      } else if (!studentPositionI && student.position === 0) {
        student.position = pos;
        break;
      }
    }
  }
}
