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
        // console.log(response);
        let i = 0;
        response['data']['sociometricTest'].questionBank.questions.forEach((question) => {
          switch (question.type) {
            case 'Liderazgo':
              const newLeadQuestion = new Question(
                question.id,
                i,
                true,
                new Array<Student>(),
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
                new Array<Student>(),
                new Array<Student>(),
                'Incomplete'
              );

              questions.push(newQuestion);
              i++;

              newQuestion = new Question(
                question.id,
                i,
                true,
                new Array<Student>(),
                new Array<Student>(),
                'Incomplete'
              );

              questions.push(newQuestion);
              break;
          }
          i++;
        });

        // console.log(questions);
        return { response: response['data'], questions };
      }),
      catchError(this.handleError())
    );
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
