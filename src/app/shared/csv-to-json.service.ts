import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import CsvHeaders from './../shared/csv-headers.json';
import DictionaryJson from '../../assets/dictionary.json';

@Injectable({
  providedIn: 'root'
})
export class CsvToJsonService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  csvJSON(file: Blob, group: string): Observable<unknown> {
    const reader: FileReader = new FileReader();
    reader.readAsText(file, 'ISO-8859-1');

    return new Observable<unknown>((observer) => {
      reader.onload = () => {
        observer.next(this.transform(reader.result as string, group));
      };
    });
  }

  // var csv is the CSV file with headers
  transform(csv: string, group: string): unknown {
    // Get headers
    const availableHeaders = CsvHeaders.headers[group];
    const dictionary = DictionaryJson.dictionary['users'];

    const lines = csv.split('\n');
    const result = [];
    // eslint-disable-next-line prefer-const
    let realHeaders = new Array<any>();
    // Validate headers
    const headers = lines[0].split(',');

    if (Object.keys(availableHeaders).length === headers.length){
      // thrown error
    }

    headers.forEach((header) => {
      Object.keys(availableHeaders).forEach((key) => {
        if (dictionary[key].toLowerCase() == header.toLowerCase().trim()) {
          realHeaders.push(key);
        }
      });
    });
    // TODO: Thrown error if the columns don't exists

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < realHeaders.length; j++) {
        if (currentline[j] !== undefined) {
          if (currentline[j].includes(';')) {
            const field = currentline[j].split(';');
            obj[realHeaders[j]] = field;
          } else {
            obj[realHeaders[j]] = currentline[j];
          }
        }
      }

      result.push(obj);
    }

    return result; //JSON
  }
}
