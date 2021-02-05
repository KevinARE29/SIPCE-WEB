import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { es } from 'date-fns/locale';
import { addMinutes, differenceInMinutes, format, formatDistanceStrict } from 'date-fns';

import { environment } from 'src/environments/environment';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Preset } from './preset.model';

@Injectable({
  providedIn: 'root'
})
export class PresetService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  createPreset(id: number, preset: Preset): Observable<Preset> {
    const data = JSON.stringify({
      startedAt: preset.startedAt,
      endedAt: addMinutes(new Date(preset.startedAt), preset.duration)
    });

    return this.http.post<Preset>(`${this.baseUrl}sociometric/tests/${id}/presets`, data).pipe(
      map((result) => {
        const data = result['data'];

        data.duration = differenceInMinutes(new Date(data.endedAt), new Date(data.startedAt));
        data.durationInWords = formatDistanceStrict(new Date(data.endedAt), new Date(data.startedAt), {
          locale: es
        });
        data.startedAtInWords = format(new Date(data.startedAt), 'iii d/MMMM/yyyy K:mm a', { locale: es });
        data.isPassVisible = false;

        return data;
      }),
      catchError(this.handleError())
    );
  }

  updatePreset(id: number, preset: Preset): Observable<Preset> {
    const data = JSON.stringify({
      startedAt: preset.startedAt,
      endedAt: addMinutes(new Date(preset.startedAt), preset.duration)
    });

    return this.http.patch<Preset>(`${this.baseUrl}sociometric/tests/${id}/presets/${preset.id}`, data).pipe(
      map((result) => {
        const data = result['data'];

        data.duration = differenceInMinutes(new Date(data.endedAt), new Date(data.startedAt));
        data.durationInWords = formatDistanceStrict(new Date(data.endedAt), new Date(data.startedAt), {
          locale: es
        });
        data.startedAtInWords = format(new Date(data.startedAt), 'iii d/MMMM/yyyy K:mm a', { locale: es });
        data.isPassVisible = false;

        return data;
      }),
      catchError(this.handleError())
    );
  }

  deletePreset(id: number, presetId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}sociometric/tests/${id}/presets/${presetId}`)
      .pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('presets', error.error.message);
      return throwError(error.error);
    };
  }
}
