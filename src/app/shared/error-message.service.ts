/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import DictionaryJson from '../../assets/dictionary.json';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  transformMessage(module: string, error: any): any {
    let dictionary: any;
    let response = error;

    if (module) dictionary = DictionaryJson.dictionary[module];

    if (Array.isArray(error)) {
      const newMessage = new Array<string>();

      error.forEach((m) => {
        const field = m.split(':');

        if (dictionary.hasOwnProperty(field[0])) {
          m = m.replace(field[0], dictionary[field[0]]);
        }

        newMessage.push(m);
      });

      response = newMessage;
    } else if (typeof error === 'string') {
      const field = error.split(':');
      if (dictionary.hasOwnProperty(field[0])) {
        error = error.replace(field[0], dictionary[field[0]]);
      }

      response = error;
    } else if (typeof error === 'object') {
      const newMessage: { [key: string]: { message: unknown } } = {};

      Object.keys(error).forEach((e) => {
        const field = error[e].split(':');

        if (dictionary.hasOwnProperty(field[0])) {
          error[e] = error[e].replace(field[0], dictionary[field[0]]);
          newMessage[e] = { message: error[e] };
        }
      });

      response = newMessage;
    }

    return response;
  }
}
