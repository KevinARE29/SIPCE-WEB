import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;

  constructor() {}

  setupSocketConnection(username: string): Promise<Observable<void>> {
    this.socket = io(`${environment.socketURL}/requests`, { query: `username=${username}` });

    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        resolve(fromEvent(this.socket, 'newRequest'))
      });
    });
  }

  closeConnection(): void {
    if (this.socket) this.socket.disconnect();
  }
}
