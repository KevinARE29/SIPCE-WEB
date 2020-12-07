import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SociometricResultService } from 'src/app/sociometric/shared/sociometric-result/sociometric-result.service';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';

import { Question } from 'src/app/sociometric/shared/question.model';
import { GrupalResult } from 'src/app/sociometric/shared/sociometric-result/grupal-result.model';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';

@Component({
  selector: 'app-sociometric-grupal-result',
  templateUrl: './sociometric-grupal-result.component.html',
  styleUrls: ['./sociometric-grupal-result.component.css']
})
export class SociometricGrupalResultComponent implements OnInit {
  testId: number;

  sociometricTest: SociometricTest;
  questions: Question[];
  loadingTest: boolean;

  questionId: number;

  sociometricResult: GrupalResult;
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

    this.questions = [];

    this.loadingTest = true;
    this.sociometricTestService.getSociometricTest(this.testId).subscribe((r) => {
      this.sociometricTest = r['data'];
      this.questions = this.sociometricTest.questionBank.questions;
      this.loadingTest = false;
    });
  }

  onQuestionSelect(): void {
    this.loadingResult = true;
    this.sociometricResultService.getQuestionGrupalResult(this.testId, this.questionId).subscribe((r) => {
      this.sociometricResult = r;
      this.loadingResult = false;
    });
  }
}
