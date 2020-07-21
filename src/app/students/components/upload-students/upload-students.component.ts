import { Component, OnInit } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import DictionaryJson from './../../../../assets/dictionary.json';
import { CsvToJsonService } from 'src/app/shared/csv-to-json.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-upload-students',
  templateUrl: './upload-students.component.html',
  styleUrls: ['./upload-students.component.css']
})
export class UploadStudentsComponent implements OnInit {
  csv: Blob;
  fileList: UploadFile[];
  loading = false;
  shift: number;
  // grades: Grade[]; //TODO: Get the grades from its module
  shifts: unknown; // TODO: Get data from service

  // Pre upload users errors
  uploadMsg: string;
  shiftMsg: string;

  // Table structure
  listOfColumns = {};
  _listOfColumns: any;
  listOfData: [];
  editCache: { [key: string]: { edit: boolean; data: unknown } } = {};

  constructor(
    private csvToJsonService: CsvToJsonService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.uploadMsg = '';
    this.shiftMsg = '';

    // TODO: Get data from service
    this.shifts = [
      { id: 1, value: 'Mañana' },
      { id: 2, value: 'Tarde' },
      { id: 3, value: 'Nocturno' },
      { id: 4, value: 'Mixto' },
      { id: 5, value: 'Tiempo completo' }
    ];
  }

  beforeUpload = (file: UploadFile) => {
    this.uploadMsg = '';
    return new Observable((observer: Observer<boolean>) => {
      const isCsv = file.type === 'application/vnd.ms-excel' || file.type === 'text/csv';
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

  handleChange = (): boolean => {
    this.csv = null;
    this.fileList = null;
    return true;
  };

  uploadCsv(): void {
    this.uploadMsg = '';

    if (this.csv === undefined || this.csv === null) this.uploadMsg = 'El archivo es requerido';
    if (this.shift === undefined) this.shiftMsg = 'El turno es requerido';
    if (this.csv && this.shift) {
      this.csvToJsonService.csvJSON(this.csv, 'students').subscribe(
        (r) => {
          this._listOfColumns = JSON.parse(JSON.stringify(r['headers']));
          this.generateTable(r);
        },
        (error) => {
          this.notification.create('error', 'Ocurrió un error al intentar cargar el archivo.', error, {
            nzDuration: 0
          });
        }
      );
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

  generateTable(r): void {
    const dictionary = DictionaryJson.dictionary['students'];

    for (let i = 0; i < r.headers.length; i++) {
      if (dictionary.hasOwnProperty(r.headers[i])) {
        r.headers[i] = dictionary[r.headers[i]];
      }
    }

    this.listOfColumns = r.headers;
    this.listOfData = r.data;

    // this.validateGrade();
    this.updateEditCache();
  }

  /**********      Table methods     **********/
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item['id'] === id);
    const lastValue = this.listOfData[index];
    this.editCache[id] = {
      data: JSON.parse(JSON.stringify(lastValue)),
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item['id'] === id);
    this.editCache[id].data = this.csvToJsonService.validateUpdatedRow(
      'students',
      this._listOfColumns,
      this.editCache[index].data
    );
    Object.assign(this.listOfData[index], this.editCache[id].data);
    // this.validateGrade();
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item['id']] = {
        edit: false,
        data: JSON.parse(JSON.stringify(item))
      };
    });
  }

  removeRow(id: string): void {
    this.listOfData = JSON.parse(JSON.stringify(this.listOfData.filter((d) => d['id'] !== id)));
  }

  createStudents(): void {}

  toggleMessage(): void {
    this.shift === null || this.shift === undefined ? (this.shiftMsg = 'El turno es requerido') : (this.shiftMsg = '');
  }

  clearScreen(): void {
    // Clear options and messages
    this.csv = null;
    this.fileList = null;
    this.listOfColumns = {};
    this._listOfColumns = null;
    this.listOfData = [];
    this.editCache = {};

    this.uploadMsg = '';
  }
}
