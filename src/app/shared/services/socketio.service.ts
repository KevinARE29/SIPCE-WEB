import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;

  constructor() {}

  setupSocketConnection(username: string): void {
    console.log(environment.socketURL);
    this.socket = io(`${environment.socketURL}/requests`, { query: `username=${username} ` });

    this.socket.on('joinedRoom', (data: string) => {
      console.log(data);
    });
  }

  requestListener(): Observable<void> {
    console.log('Ok');
    this.socket.on('newRequest', () => {
      return new Observable<void>((observer) => {
        observer.next();
      });
    });

    return new Observable<void>((observer) => {
      observer.next();
    });
  }
}
