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
        const customJson = this.transform(reader.result as string, group);

        if (customJson === 'quantityError') {
          observer.error('Verifique que la cantidad de columnas coincidan con las del archivo esperado.');
        } else if (customJson === 'wrongColumns') {
          observer.error('Verifique que las columnas ingresadas correspondan a las esperadas.');
        } else {
          observer.next(customJson);
        }
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
      return 'quantityError';
    }

    headers.forEach((header) => {
      Object.keys(availableHeaders).forEach((key) => {
        if (dictionary[key].toLowerCase() == header.toLowerCase().trim()) {
          realHeaders.push(key);
          availableHeaders[key].check = true;
        }
      });
    });

    for (const header of Object.keys(availableHeaders)) {
      if (!availableHeaders[header].check) {
        return 'wrongColumns';
        break;
      }
    }

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

              if (realHeaders[j] === 'grades') {
                for (let k = 0; k < field.length; k++) {
                  multiple[k] = { value: field[k].trim(), isValid: true, message: null, grade: null };
                }
              } else {
                for (let k = 0; k < field.length; k++) {
                  multiple[k] = { value: field[k].trim(), isValid: true, message: null };
                }
              }

              obj[realHeaders[j]] = {
                value: multiple, // The field to be written in the table
                isValid: true, // Define if the value is valid
                message: null // Indicate the error message related to the field
              };
            } else if (realHeaders[j] === 'cycle') {
              obj[realHeaders[j]] = {
                value: currentline[j].trim(),
                isValid: true,
                message: null,
                cycle: null
              };
            } else if (realHeaders[j] === 'grades') {
              const multiple = {};
              multiple[0] = { value: currentline[j].trim(), isValid: true, message: null, grade: null };

              obj[realHeaders[j]] = {
                value: multiple,
                isValid: true,
                message: null
              };
            } else if (realHeaders[j] === 'section') {
              obj[realHeaders[j]] = {
                value: currentline[j].trim(),
                isValid: true,
                message: null,
                section: null
              };
            } else {
              obj[realHeaders[j]] = {
                value: currentline[j].trim(),
                isValid: true,
                message: null
              };
            }

            // Validate the field
            this.validateField(availableHeaders[realHeaders[j]], obj[realHeaders[j]], realHeaders[j]);
          }
        }

        obj['inlineError'] = null;

        result.push(obj);
      }
    }

    return { headers: realHeaders, data: result }; //JSON
  }

  /*--------------- Validate fields and rows ---------------*/
  validateField(header, field, entity): void {
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
          case 'exists':
            if (typeof field.value === 'object') {
              Object.keys(field.value).forEach((value) => {
                const temporalField = field['value'][value].value;
                const assign = this.exists(temporalField, entity);

                if (!assign) {
                  field.isValid = false;
                  field.message = validate.message;
                } else {
                  field.isValid = true;
                  field.message = null;
                }

                switch (entity) {
                  case 'grades':
                    field['value'][value]['grade'] = assign;
                    break;
                }
              });
            } else if (typeof field.value === 'string') {
              const temporalField = field.value;

              if (!entity) {
                if (field.cycle) entity = 'cycle';
                else if (field.grade) entity = 'grade';
                else if (field.section) entity = 'section';
              }

              if (field.hasOwnProperty('cycle')) {
                entity = 'cycle';
              } else if (field.hasOwnProperty('grade')) {
                entity = 'grade';
              } else if (field.hasOwnProperty('section')) {
                entity = 'section';
              }

              const assign = this.exists(temporalField, entity);
              if (assign === undefined || assign === null) {
                field.isValid = false;
                field.message = validate.message;
              } else {
                field.isValid = true;
                field.message = null;
              }

              switch (entity) {
                case 'cycle':
                  field.cycle = assign ? assign : null;
                  break;
                case 'grade':
                  field.grade = assign ? assign : null;
                  break;
                case 'section':
                  field.section = assign ? assign : null;
                  break;
              }
            }
            break;
        }
      }
    });
    return;
  }

  validateUpdatedRow(group, headers, row, data): any {
    const availableHeaders = CsvHeaders.headers[group];
    headers.forEach((h) => {
      // TODO: Use the real data
      this.validateField(availableHeaders[h], row[h], null);
    });

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

  exists(field: string, entity: string): any {
    let found = null;
    switch (entity) {
      case 'cycle':
        found = this.availableCycles.find((element) => element.name.toLowerCase() === field.toLowerCase());
        break;
      case 'grades':
      case 'grade':
        found = this.availableGrades.find((element) => element.name.toLowerCase() === field.toLowerCase());
        break;
      case 'section':
        found = this.availableSections.find((element) => element.name.toLowerCase() === field.toLowerCase());
        break;
    }
    return found;
  }

  replaceAccents(text: string): string {
    const chars = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      à: 'a',
      è: 'e',
      ì: 'i',
      ò: 'o',
      ù: 'u',
      ñ: 'n',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
      À: 'A',
      È: 'E',
      Ì: 'I',
      Ò: 'O',
      Ù: 'U',
      Ñ: 'N'
    };

    const expr = /[áàéèíìóòúùñ]/gi;
    const res = text.replace(expr, function (e) {
      return chars[e];
    });

    return res;
  }

  // Change with the api response when its available
  availableGrades = [
    { id: 13, name: 'Kínder 4' },
    { id: 14, name: 'Kínder 5' },
    { id: 15, name: 'Parvularia' },
    { id: 1, name: 'Primero' },
    { id: 2, name: 'Segundo' },
    { id: 3, name: 'Tercero' },
    { id: 4, name: 'Cuarto' },
    { id: 5, name: 'Quinto' },
    { id: 6, name: 'Sexto' },
    { id: 7, name: 'Séptimo' },
    { id: 8, name: 'Octavo' },
    { id: 9, name: 'Noveno' },
    { id: 10, name: 'Primero Bachillerato' },
    { id: 11, name: 'Segundo Bachillerato' },
    { id: 12, name: 'Tercero Bachillerato' }
  ];

  availableCycles = [
    { id: 1, name: 'Primer ciclo' },
    { id: 2, name: 'Segundo ciclo' },
    { id: 3, name: 'Tercer ciclo' },
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
    { id: 11, name: 'Mecánica' },
    { id: 12, name: 'Contable' },
    { id: 13, name: 'Computación' }
  ];
}
