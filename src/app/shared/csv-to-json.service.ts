import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

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
    /*---------------    Get headers     ---------------*/
    const availableHeaders = CsvHeaders.headers[group];
    const dictionary = DictionaryJson.dictionary['users'];

    const lines = csv.split('\n');
    const result = [];
    const realHeaders = new Array<any>();
    const headers = lines[0].split(',');

    /*---------------    Validate headers     ---------------*/
    if (Object.keys(availableHeaders).length !== headers.length) {
      // TODO: Throw error
      console.log('Error: Verifique que la cantidad de columnas coincidan con las del archivo esperado.');
    }
    headers.forEach((header) => {
      Object.keys(availableHeaders).forEach((key) => {
        if (dictionary[key].toLowerCase() == header.toLowerCase().trim()) {
          realHeaders.push(key);
          availableHeaders[key].check = true;
        }
      });
    });

    // TODO: Throw error if the required columns don't exists in the file
    Object.keys(availableHeaders).forEach((header) => {
      if (!availableHeaders[header].check)
        console.log('Error: Verifique que las columnas ingresadas correspondan a las esperadas.');
    });

    /*--------------- Transform csv to json ---------------*/
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      obj['id'] = i - 1;

      if (currentline.length === realHeaders.length) {
        for (let j = 0; j < realHeaders.length; j++) {
          if (currentline[j] !== undefined) {
            if (currentline[j].includes(';')) {
              const field = currentline[j].split(';');
              const multiple = {};

              for (let k = 0; k < field.length; k++) {
                multiple[k] = { value: field[k], isValid: true, message: null };
              }

              obj[realHeaders[j]] = {
                value: multiple, // The field to be written in the table
                isValid: true, // Define if the value is valid
                message: null // Indicate the error message related to the field
              };
            } else {
              obj[realHeaders[j]] = {
                value: currentline[j].trim(),
                isValid: true,
                message: null
              };
            }
            // Validate the field
            this.validateField(availableHeaders[realHeaders[j]], obj[realHeaders[j]]);
          }
        }

        result.push(obj);
      }
    }

    return { headers: realHeaders, data: result }; //JSON
  }

  /*--------------- Validate fields and rows ---------------*/
  validateField(header, field): void {
    const initState = field.isValid;

    header['validations'].forEach((validate) => {
      if (field.isValid === initState) {
        switch (validate.value) {
          case 'empty':
            if (typeof field.value === 'object') {
              Object.keys(field.value).forEach((value) => {
                if (this.empty(value)) {
                  field.isValid = false;
                  field.message = validate.message;
                } else {
                  field.isValid = true;
                  field.message = null;
                }
              });
            } else if (typeof field.value === 'string') {
              if (this.empty(field.value)) {
                field.isValid = false;
                field.message = validate.message;
              } else {
                field.isValid = true;
                field.message = null;
              }
            }
            break;
          case 'text':
            if (typeof field.value === 'object') {
              Object.keys(field.value).forEach((value) => {
                if (!this.text(value)) {
                  field.isValid = false;
                  field.message = validate.message;
                } else {
                  field.isValid = true;
                  field.message = null;
                }
              });
            } else if (typeof field.value === 'string') {
              if (!this.text(field.value)) {
                field.isValid = false;
                field.message = validate.message;
              } else {
                field.isValid = true;
                field.message = null;
              }
            }
            break;
          case 'email':
            if (typeof field.value === 'object') {
              Object.keys(field.value).forEach((value) => {
                if (!this.email(value)) {
                  field.isValid = false;
                  field.message = validate.message;
                } else {
                  field.isValid = true;
                  field.message = null;
                }
              });
            } else if (typeof field.value === 'string') {
              if (!this.email(field.value)) {
                field.isValid = false;
                field.message = validate.message;
              } else {
                field.isValid = true;
                field.message = null;
              }
            }
            break;
          // case 'exist':
          //   break;
        }
      }
    });
    return;
  }

  validateUpdatedRow(group, headers, row, data): any {
    const availableHeaders = CsvHeaders.headers[group];
    headers.forEach((h) => {
      this.validateField(availableHeaders[h], row[h]);
    });

    // console.log(row);
    return row;
  }

  text(field): boolean {
    return typeof field === 'string' || field instanceof String;
  }

  empty(field): boolean {
    return field.length <= 0;
  }

  email(field): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(field);
  }

  exist(field, entity): boolean {
    switch (entity) {
      case 'cycle':
        break;
      case 'grades':
        break;
      case 'grade':
        break;
      case 'section':
        break;
    }
    return true;
  }

  // Change with the api response when its available
  availableGrades = [
    { id: 1, name: 'Kínder 4' },
    { id: 2, name: 'Kínder 5' },
    { id: 3, name: 'Parvularia' },
    { id: 4, name: 'Primero' },
    { id: 5, name: 'Segundo' },
    { id: 6, name: 'Tercero' },
    { id: 7, name: 'Cuarto' },
    { id: 8, name: 'Quinto' },
    { id: 9, name: 'Sexto' },
    { id: 10, name: 'Séptimo' },
    { id: 11, name: 'Octavo' },
    { id: 12, name: 'Noveno' },
    { id: 13, name: 'Primero Bachillerato' },
    { id: 14, name: 'Segundo Bachillerato' },
    { id: 15, name: 'Tercero Bachillerato' }
  ];

  availableCycles = [
    { id: 1, name: 'Primer ciclo' },
    { id: 2, name: 'Segundo ciclo' },
    { id: 3, name: 'Tercer Ciclo' },
    { id: 4, name: 'Cuarto ciclo' }
  ];

  availableSections = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' },
    { id: 5, name: 'E' },
    { id: 6, name: 'F' },
    { id: 7, name: 'G' },
    { id: 8, name: 'General' },
    { id: 9, name: 'Electrónica' },
    { id: 10, name: 'Electrotecnia' },
    { id: 11, name: 'Mécanica' },
    { id: 12, name: 'Contable' },
    { id: 13, name: 'Computación' }
  ];
}
