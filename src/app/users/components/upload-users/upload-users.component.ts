import { Component, OnInit } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';

import DictionaryJson from './../../../../assets/dictionary.json';
import { CsvToJsonService } from './../../../shared/csv-to-json.service';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css']
})
export class UploadUsersComponent implements OnInit {
  csv: Blob;
  fileList: UploadFile[];
  userGroup: string;
  userGroups: unknown;
  shift: number;
  // TODO: Get data from service
  shifts: unknown;

  // Pre upload users errors
  uploadMsg: string;
  groupMsg: string;
  shiftMsg: string;

  // Table structure
  listOfColumns = {};
  _listOfColumns = {};
  listOfData: [];
  editCache: { [key: string]: { edit: boolean; data: unknown } } = {};

  constructor(private csvToJsonService: CsvToJsonService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.uploadMsg = '';
    this.groupMsg = '';
    this.shiftMsg = '';

    this.userGroups = [
      { id: 'administrativeStaff', value: 'Administrativos' },
      { id: 'cycleCoordinators', value: 'Coordinadores de ciclo' },
      { id: 'teachers', value: 'Docentes' },
      { id: 'counselors', value: 'Orientadores' }
    ];
    // TODO: Get data from service
    this.shifts = [
      { id: 1, value: 'Mañana' },
      { id: 2, value: 'Tarde' },
      { id: 3, value: 'Nocturno' },
      { id: 4, value: 'Mixto' },
      { id: 5, value: 'Tiempo completo' }
    ];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  beforeUpload = (file: UploadFile) => {
    this.uploadMsg = '';
    return new Observable((observer: Observer<boolean>) => {
      const isCsv = file.type === 'application/vnd.ms-excel';
      if (!isCsv) {
        // Only CSV allowed
        this.message.error('Solo se permiten archivos en formato csv');
        observer.complete();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        // File must be smaller than 2MB
        this.message.error('El archivo debe pesar menos de 2MB.');
        observer.complete();
        return;
      }
      observer.next(isCsv && isLt2M);
      observer.complete();
    });
  };

  uploadCsv(): void {
    this.uploadMsg = '';
    this.groupMsg = '';
    this.shiftMsg = '';

    if (this.csv === undefined) this.uploadMsg = 'El archivo es requerido';
    if (this.userGroup === undefined) this.groupMsg = 'El grupo de usuario es requerido';
    if (this.shift === undefined && this.userGroup !== 'administrativeStaff') this.shiftMsg = 'El turno es requerido';

    if (this.csv && this.userGroup) {
      let allowed = true;
      if (this.userGroup !== 'administrativeStaff') {
        if (this.shift === null || this.shift === undefined) allowed = false;
      }

      if (allowed) {
        this.csvToJsonService.csvJSON(this.csv, this.userGroup).subscribe(
          (r) => {
            console.log(r);
            this._listOfColumns = JSON.parse(JSON.stringify(r['headers']));
            this.generateTable(r);
          },
          (error) => {
            console.log('Error');
            console.log(error);
          }
        );
      }
    }
  }

  customReq = (item: unknown): void => {
    this.csv = item['file'];
    this.fileList = [
      {
        uid: item['file'].uid,
        name: item['file'].name,
        status: 'done',
        response: '{"status": "success"}'
      }
    ];
  };

  toggleMessage(): void {
    this.userGroup !== null ? (this.groupMsg = '') : (this.groupMsg = 'El grupo de usuario es requerido');
    if (this.userGroup === 'administrativeStaff' && this.shiftMsg.length > 0) this.shiftMsg = '';
    else if (this.userGroup !== 'administrativeStaff') {
      this.shift === null || this.shift === undefined
        ? (this.shiftMsg = 'El turno es requerido')
        : (this.shiftMsg = '');
    }
  }

  generateTable(r): void {
    const dictionary = DictionaryJson.dictionary['users'];

    for (let i = 0; i < r.headers.length; i++) {
      if (dictionary.hasOwnProperty(r.headers[i])) {
        r.headers[i] = dictionary[r.headers[i]];
      }
    }

    this.listOfColumns = r.headers;
    this.listOfData = r.data;
    this.updateEditCache();
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
    console.log(this.editCache[id].data);
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item['id'] === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
    console.log(this.editCache);
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item['id'] === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item['id']] = {
        edit: false,
        data: { item }
      };
    });
  }
}
