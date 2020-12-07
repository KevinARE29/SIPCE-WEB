import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SociometricResultService } from 'src/app/sociometric/shared/sociometric-result/sociometric-result.service';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';

import { Question } from 'src/app/sociometric/shared/question.model';
import { IndividualResult } from 'src/app/sociometric/shared/sociometric-result/individual-result.model';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { Student } from 'src/app/students/shared/student.model';

@Component({
  selector: 'app-sociometric-individual-result',
  templateUrl: './sociometric-individual-result.component.html',
  styleUrls: ['./sociometric-individual-result.component.css']
})
export class SociometricIndividualResultComponent implements OnInit {
  testId: number;
  studentId: number;

  sociometricTest: SociometricTest;
  questions: Question[];
  student: Student;
  loadingTest: boolean;

  questionId: number;

  sociometricResult: IndividualResult;
  loadingResult: boolean;

  constructor(
    private route: ActivatedRoute,
    private sociometricTestService: SociometricTestService,
    private sociometricResultService: SociometricResultService
  ) {}

  ngOnInit(): void {
    const testParam = this.route.snapshot.params['sociometrictest'];
    if (typeof testParam === 'string' && !Number.isNaN(Number(testParam))) {
      this.testId = Number(testParam);
    }

    const studentParam = this.route.snapshot.params['studentId'];
    if (typeof studentParam === 'string' && !Number.isNaN(Number(studentParam))) {
      this.studentId = Number(studentParam);
    }

    this.questions = [];

    this.loadingTest = true;
    this.sociometricTestService.getSociometricTest(this.testId).subscribe((r) => {
      this.sociometricTest = r['data'];
      this.student = this.sociometricTest.students.find((student) => student.id === this.studentId);
      this.questions = this.sociometricTest.questionBank.questions;
      this.loadingTest = false;
    });
  }

  onQuestionSelect(): void {
    this.loadingResult = true;
    this.sociometricResultService
      .getQuestionIndividualResult(this.testId, this.questionId, this.studentId)
      .subscribe((r) => {
        this.sociometricResult = r;
        console.log(this.sociometricResult);
        this.loadingResult = false;
      });
  }
}
