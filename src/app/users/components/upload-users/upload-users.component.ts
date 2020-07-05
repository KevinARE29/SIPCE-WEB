import { Component, OnInit } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';

import { CsvToJsonService } from './../../../shared/csv-to-json.service';

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
        this.csvToJsonService.csvJSON(this.csv, this.userGroup).subscribe((r) => {
          console.log(r);
        });
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
}
