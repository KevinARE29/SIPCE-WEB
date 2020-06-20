import { Injectable } from '@angular/core';

import DictionaryJson from '../../assets/dictionary.json';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor() { }

  transformMessage(module: string, error: any): any{
    let dictionary: any;
    let response: any = error;

    if(module)
      dictionary = DictionaryJson.dictionary[module];

    if(Array.isArray(error)){
      let newMessage = new Array<string>();
        
      error.forEach( m => {
        let field  = m.split(":");

        if(dictionary.hasOwnProperty(field[0])){
          m = m.replace(field[0], dictionary[field[0]]);
        }
        
        newMessage.push(m);
      });

      response = newMessage;
    } else if(typeof error === 'string'){
      let field  = error.split(":");

      if(dictionary.hasOwnProperty(field[0])){
        error = error.replace(field[0], dictionary[field[0]]);
      } 

      response = error;
    }

    return response;
  }
}
