import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SectionService } from 'src/app/academic-catalogs/shared/section.service';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Question } from './question.model';
import { Student } from 'src/app/students/shared/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentSociometricTestService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private sectionService: SectionService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getSociometricTest(id: number, studentId: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}sociometric/tests/${id}/students/${studentId}`).pipe(
      map((response) => {
        const questions = new Array<Question>();
        let i = 0;
        response['data']['sociometricTest'].questionBank.questions.forEach((question) => {
          switch (question.type) {
            case 'Liderazgo':
              const newLeadQuestion = new Question(
                question.id,
                i,
                true,
                question.questionP,
                new Array<Student>(),
                'Incomplete'
              );

              questions.push(newLeadQuestion);
              break;
            case 'Aceptación/Rechazo':
              let newQuestion = new Question(
                question.id,
                i,
                true,
                question.questionP,
                new Array<Student>(),
                'Incomplete'
              );

              questions.push(newQuestion);
              i++;

              newQuestion = new Question(question.id, i, false, question.questionN, new Array<Student>(), 'Incomplete');

              questions.push(newQuestion);
              break;
          }
          i++;
        });

        return { response: response['data'], questions };
      }),
      catchError(this.handleError())
    );
  }

  getStudentTest(data: { email: string; password: string }): Observable<unknown>{
    return this.http
      .post<unknown>(`${this.baseUrl}sociometric/tests/student-access`, data)
      .pipe(catchError(this.handleError()));
  }

  saveResponse(question: Question, test: unknown): Observable<void> {
    const sociometricTestId = test['sociometricTest'].id;
    const studentId = test['student'].id;
    const studentIds = new Array<number>();

    let students = question.students.filter((x) => x.position !== 0);
    students = students.sort((a, b) => a.position - b.position);
    students.forEach((student) => studentIds.push(student.id));

    const data = JSON.stringify({
      connotation: question.connotation,
      questionId: question.id,
      studentIds: studentIds
    });

    return this.http
      .put<void>(`${this.baseUrl}sociometric/tests/${sociometricTestId}/students/${studentId}`, data)
      .pipe(catchError(this.handleError()));
  }

  completeTest(test: unknown): Observable<void> {
    const sociometricTestId = test['sociometricTest'].id;
    const studentId = test['student'].id;

    return this.http
      .patch<void>(`${this.baseUrl}sociometric/tests/${sociometricTestId}/students/${studentId}`, null)
      .pipe(catchError(this.handleError()));
  }

  mergeTestData(testId: number, sectionId: number, studentId: number): Observable<unknown> {
    return forkJoin({
      test: this.getSociometricTest(testId, studentId),
      students: this.sectionService.getAllSectionStudents(sectionId)
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('sociometric-tests', error.error.message);
      return throwError(error.error);
    };
  }
}
