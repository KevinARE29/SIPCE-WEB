import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { isValid } from 'date-fns';

import CsvHeaders from './../shared/csv-headers.json';
import DictionaryJson from '../../assets/dictionary.json';
import { KinshipRelationship } from './kinship-relationship.enum';

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
    const dictionary = DictionaryJson.dictionary[group];

    const lines = csv.split('\n');
    const result = [];
    const realHeaders = new Array<any>();
    const headers = lines[0].split(',');
    console.log(availableHeaders, dictionary, headers);
    /*---------------    Validate headers     ---------------*/
    if (group === 'students') {
      if (
        Object.keys(availableHeaders).length !== headers.length &&
        Object.keys(availableHeaders).length - 2 !== headers.length
      ) {
        return 'quantityError';
      }
    } else {
      if (Object.keys(availableHeaders).length !== headers.length) {
        return 'quantityError';
      }
    }

    headers.forEach((header) => {
      Object.keys(availableHeaders).forEach((key) => {
        if (dictionary.hasOwnProperty(key)) {
          if (dictionary[key].toLowerCase() == header.toLowerCase().trim()) {
            realHeaders.push(key);
            availableHeaders[key].check = true;
          }
        }
      });
    });

    for (const header of Object.keys(availableHeaders)) {
      if (!availableHeaders[header].check && !availableHeaders[header].optional) {
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

              if (realHeaders[j] === 'role') {
                for (let k = 0; k < field.length; k++) {
                  multiple[k] = { value: field[k].trim(), isValid: true, message: null, role: null };
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
            } else {
              if (realHeaders[j] === 'role') {
                const role = new Array<any>();
                role.push({
                  value: currentline[j].trim() ? currentline[j].trim() : null,
                  message: null,
                  isValid: true,
                  role: null
                });

                obj[realHeaders[j]] = {
                  value: role,
                  isValid: true,
                  message: null
                };
              } else if (realHeaders[j] === 'grade') {
                obj[realHeaders[j]] = {
                  value: currentline[j].trim(),
                  isValid: true,
                  message: null,
                  grade: null
                };
              } else {
                obj[realHeaders[j]] = {
                  value: currentline[j].trim(),
                  isValid: true,
                  message: null
                };
              }
            }

            // Validate the field
            this.validateField(availableHeaders[realHeaders[j]], obj[realHeaders[j]]);
          }
        }

        obj['inlineError'] = null;

        result.push(obj);
      }
    }

    return { headers: realHeaders, data: result }; //JSON
  }

  /*--------------- Validate fields and rows ---------------*/
  validateField(header, field): void {
    let flag = true;

    header['validations'].forEach((validate) => {
      switch (validate.value) {
        case 'empty':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (this.empty(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (this.empty(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'text':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (!this.text(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (!this.text(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'textnumber':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (!this.textnumber(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (!this.textnumber(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'email':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (!this.email(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (!this.email(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'phoneNumber':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (!this.phoneNumber(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (!this.phoneNumber(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'date':
          if (typeof field.value === 'string') {
            if (!field.transformed) {
              const dateComponents = field.value.split('/');
              field.value = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);
              field.transformed = true;
            }
            if (!this.date(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'kinship':
          if (typeof field.value === 'string') {
            if (!this.kinship(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'number':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (!this.number(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (!this.number(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
        case 'year':
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((value) => {
              if (!this.year(value)) {
                field.isValid = false;
                field.message = validate.message;
                flag = false;
              } else {
                if (flag) {
                  field.isValid = true;
                  field.message = null;
                }
              }
            });
          } else if (typeof field.value === 'string') {
            if (!this.year(field.value)) {
              field.isValid = false;
              field.message = validate.message;
              flag = false;
            } else {
              if (flag) {
                field.isValid = true;
                field.message = null;
              }
            }
          }
          break;
      }
    });
    return;
  }

  validateUpdatedRow(group, headers, row): any {
    const availableHeaders = CsvHeaders.headers[group];
    headers.forEach((h) => {
      this.validateField(availableHeaders[h], row[h]);
    });

    return row;
  }

  text(field): boolean {
    return /[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚ ]+$/.test(field);
  }

  textnumber(field): boolean {
    return /[A-Za-z0-9äÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚ]+$/.test(field);
  }

  empty(field): boolean {
    return field.length <= 0;
  }

  email(field): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(field);
  }

  phoneNumber(field): boolean {
    return /^[267]{1}[0-9]{3}[-]{1}[0-9]{4}$/.test(field);
  }

  date(field): boolean {
    return isValid(new Date(field));
  }

  number(field): boolean {
    return !!Number(field);
  }

  year(field): boolean {
    const year = new Date().getFullYear();
    return !!(field >= year - 15 && field <= year + 1);
  }

  kinship(field): boolean {
    return !!Object.values(KinshipRelationship).includes(field);
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
}
