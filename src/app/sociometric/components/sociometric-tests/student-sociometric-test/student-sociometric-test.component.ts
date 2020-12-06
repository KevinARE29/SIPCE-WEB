import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';

import { Question } from 'src/app/sociometric/shared/sociometric-test/question.model';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { StudentSociometricTestService } from 'src/app/sociometric/shared/sociometric-test/student-sociometric-test.service';
import { Student } from 'src/app/students/shared/student.model';

@Component({
  selector: 'app-student-sociometric-test',
  templateUrl: './student-sociometric-test.component.html',
  styleUrls: ['./student-sociometric-test.component.css']
})
export class StudentSociometricTestComponent implements OnInit {
  loading = false;
  questions: Question[];
  sectionStudents: Student[];
  currentQuestion: Question;
  currentIndex = 0;
  emptyPosition = true;
  test: { id: number; finished: boolean; answers: unknown[]; sociometricTest: SociometricTest; student: Student };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private studentSociometricTestService: StudentSociometricTestService
  ) {}

  ngOnInit(): void {
    this.test = {
      id: null,
      finished: false,
      answers: null,
      sociometricTest: new SociometricTest(),
      student: new Student()
    };
    this.currentQuestion = new Question(null, null, null, null, new Array<Student>(), null);
    this.questions = new Array<Question>();
    this.test.sociometricTest.grade = new ShiftPeriodGrade();
    this.test.sociometricTest.section = new ShiftPeriodGrade();
    this.getSociometricTest();
  }

  getSociometricTest(): void {
    this.route.paramMap.subscribe((params) => {
      const test: string = params.get('sociometrictest');
      const section: string = params.get('section');
      const param: string = params.get('student');
      let id, sectionid, testid: number;

      this.loading = true;
      if (
        typeof param === 'string' &&
        !Number.isNaN(Number(param)) &&
        typeof section === 'string' &&
        !Number.isNaN(Number(section)) &&
        typeof test === 'string' &&
        !Number.isNaN(Number(test))
      ) {
        id = Number(param);
        sectionid = Number(section);
        testid = Number(test);

        this.studentSociometricTestService.mergeTestData(testid, sectionid, id).subscribe(
          (data) => {
            this.test = {
              id: data['test']['response']['id'],
              finished: data['test']['response']['finished'],
              answers: data['test']['response']['answers'],
              sociometricTest: data['test']['response']['sociometricTest'],
              student: data['test']['response']['student']
            };

            this.questions = data['test']['questions'];
            this.sectionStudents = Object.values(data['students']['students']);
            this.sectionStudents = this.sectionStudents.filter((x) => x.id !== this.test.student.id);

            this.checkSeleted();

            this.loading = false;
            // console.log(this.test, this.questions, this.currentQuestion, this.sectionStudents);
          },
          () => {
            this.loading = false;
            this.router.navigateByUrl('/estudiantes/' + param, {
              skipLocationChange: true
            });
          }
        );
      } else {
        this.loading = false;
        this.router.navigateByUrl('/estudiantes/' + param, { skipLocationChange: true });
      }
    });
  }

  prev(): void {
    if (this.checkPositions()) {
      this.currentQuestion.status = 'Completed';
      this.currentIndex--;
      this.currentQuestion = this.questions[this.currentIndex];
      this.questions[this.currentIndex].status = 'Current';
    }
    console.log(this.currentQuestion, this.test, false);
  }
  next(): void {
    if (this.checkPositions()) {
      this.currentQuestion.status = 'Completed';
      this.currentIndex++;
      this.currentQuestion = this.questions[this.currentIndex];
      this.questions[this.currentIndex].status = 'Current';
    }
    console.log(this.currentQuestion, this.test, true, `Is it complete? ${this.checkPositions()}`);
  }
  done(): void {}

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

  checkSeleted(): void {
    // Add logic to add initial data
    this.questions.forEach((question) => {
      question.students = JSON.parse(JSON.stringify(this.sectionStudents));
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
}