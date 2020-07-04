import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvsToJsonService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  cvsJSON(file: Blob): Observable<unknown> {
    const reader: FileReader = new FileReader();
    reader.readAsText(file, 'ISO-8859-1');

    return new Observable<unknown>((observer) => {
      reader.onload = () => {
        observer.next(this.transform(reader.result as string));
      };
    });
  }

  // var csv is the CSV file with headers
  transform(csv: string): unknown {
    const lines = csv.split('\n');

    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result; //JSON
  }
}
