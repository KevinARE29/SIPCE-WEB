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
    this.test.sociometricTest.grade = new ShiftPeriodGrade();
    this.test.sociometricTest.section = new ShiftPeriodGrade();
    this.currentQuestion = new Question(null, null, null, null, null, null);
    this.questions = new Array<Question>();
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
            this.currentQuestion = this.questions[0];
            this.sectionStudents = data['students'];
            this.loading = false;
            console.log(this.test, this.questions, this.currentQuestion, this.sectionStudents);
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

  prev(): void {}
  next(): void {}
  done(): void {}

  changeCurrentQuestion(id: number): void {
    this.currentQuestion = this.questions[id];
  }
}
