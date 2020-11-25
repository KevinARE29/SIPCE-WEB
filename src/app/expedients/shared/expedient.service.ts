import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorMessageService } from 'src/app/shared/error-message.service';

import { Expedient } from './expedient.model';
import { DiagnosticImpressionCategories } from 'src/app/shared/enums/diagnostic-impression-categories.enum';
import { PsychologicalTreatmentTypes } from 'src/app/shared/enums/psychological-treatment-types.enum';

@Injectable({
  providedIn: 'root'
})
export class ExpedientService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getExpedients(studentId: number): Observable<Expedient[]> {
    const url = this.baseUrl + 'students/' + studentId + '/expedients';

    return this.http.get<Expedient[]>(url).pipe(
      map((r) => {
        return r['data'].map(this.mapExpedient);
      }),
      catchError(this.handleError())
    );
  }

  saveExpedient(studentId: number, expedient: Expedient): Observable<Expedient> {
    let url = this.baseUrl + 'students/' + studentId + '/expedients';

    const data = {
      referrerName: expedient.referrerName,
      reason: expedient.reason,
      problemDescription: expedient.problemDescription,
      diagnosticImpression: expedient.diagnosticImpression,
      actionPlan: expedient.actionPlan,
      finalConclusion: expedient.finalConclusion
    };

    // Set the "others" diagnosticImpression and psychologicalTreatment to the corresponding field.
    if (expedient.diagnosticImpressionCategories && expedient.diagnosticImpressionCategories.length) {
      data['diagnosticImpressionCategories'] = expedient.diagnosticImpressionCategories.map((category) => {
        return category === DiagnosticImpressionCategories.OTRO
          ? [category, expedient.otherDiagnosticImpressionCategory].join('|')
          : category;
      });
    }

    if (expedient.externalPsychologicalTreatments && expedient.externalPsychologicalTreatments.length) {
      data['externalPsychologicalTreatments'] = expedient.externalPsychologicalTreatments.map((treatment) => {
        return treatment === PsychologicalTreatmentTypes.OTRO
          ? [treatment, expedient.otherExternalPsychologicalTreatment].join('|')
          : treatment;
      });
    }

    if (expedient.id) {
      url += '/' + expedient.id;
      return this.http.patch<Expedient>(url, JSON.stringify(data)).pipe(
        map((r) => this.mapExpedient(r['data'])),
        catchError(this.handleError())
      );
    } else {
      return this.http.post<Expedient>(url, JSON.stringify(data)).pipe(
        map((r) => this.mapExpedient(r['data'])),
        catchError(this.handleError())
      );
    }
  }

  private mapExpedient(expedient: Expedient): Expedient {
    // Set the "others" diagnosticImpression and psychologicalTreatment to the corresponding field.
    if (Array.isArray(expedient.diagnosticImpressionCategories)) {
      expedient.diagnosticImpressionCategories.forEach((category, index) => {
        if (category.startsWith(DiagnosticImpressionCategories.OTRO)) {
          const categorySplit = category.split('|');

          expedient.diagnosticImpressionCategories[index] = categorySplit[0];

          if (categorySplit.length > 1) {
            expedient.otherDiagnosticImpressionCategory = categorySplit[1];
          }
        }
      });
    }

    if (Array.isArray(expedient.externalPsychologicalTreatments)) {
      expedient.externalPsychologicalTreatments.forEach((treatment, index) => {
        if (treatment.startsWith(PsychologicalTreatmentTypes.OTRO)) {
          const treatmentSplit = treatment.split('|');

          expedient.externalPsychologicalTreatments[index] = treatmentSplit[0];

          if (treatmentSplit.length > 1) {
            expedient.otherExternalPsychologicalTreatment = treatmentSplit[1];
          }
        }
      });
    }

    return expedient;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('sessions', error.error.message);
      return throwError(error.error);
    };
  }
}
