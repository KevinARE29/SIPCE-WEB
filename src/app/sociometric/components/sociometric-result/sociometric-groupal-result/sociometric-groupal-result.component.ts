import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SociometricResultService } from 'src/app/sociometric/shared/sociometric-result/sociometric-result.service';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';

import { Question } from 'src/app/sociometric/shared/question.model';
import { GroupalResult } from 'src/app/sociometric/shared/sociometric-result/groupal-result.model';
import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { StudentWithSociometricIndexes } from 'src/app/sociometric/shared/sociometric-result/student-with-sociometric-indexes.model';

@Component({
  selector: 'app-sociometric-groupal-result',
  templateUrl: './sociometric-groupal-result.component.html',
  styleUrls: ['./sociometric-groupal-result.component.css']
})
export class SociometricGroupalResultComponent implements OnInit {
  testId: number;

  sociometricTest: SociometricTest;
  questions: Question[];
  loadingTest: boolean;

  questionId: number;
  questionIsAboutLidership: boolean;

  sociometricResult: GroupalResult;
  loadingResult: boolean;

  // Expand table
  expandSet = new Set<number>();

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
    this.sociometricResultService.getQuestionGroupalResult(this.testId, this.questionId).subscribe((r) => {
      this.sociometricResult = r;
      this.questionIsAboutLidership = !this.questions.find((question) => question.id === this.questionId).questionN;

      this.loadingResult = false;
    });
  }

  sortIndexesByName(a: StudentWithSociometricIndexes, b: StudentWithSociometricIndexes): number {
    return a.student.firstname.localeCompare(b.student.firstname);
  }

  sortIndexesByPop(a: StudentWithSociometricIndexes, b: StudentWithSociometricIndexes): number {
    return a.pop - b.pop;
  }

  sortIndexesByAnt(a: StudentWithSociometricIndexes, b: StudentWithSociometricIndexes): number {
    return a.ant - b.ant;
  }

  sortIndexesByExpP(a: StudentWithSociometricIndexes, b: StudentWithSociometricIndexes): number {
    return a.expP - b.expP;
  }

  sortIndexesByExpN(a: StudentWithSociometricIndexes, b: StudentWithSociometricIndexes): number {
    return a.expN - b.expN;
  }

  sortIndexesByCA(a: StudentWithSociometricIndexes, b: StudentWithSociometricIndexes): number {
    return a.ca - b.ca;
  }

  // Expand table
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
