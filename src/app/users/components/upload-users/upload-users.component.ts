import { Component, OnInit } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

import DictionaryJson from './../../../../assets/dictionary.json';
import { CsvToJsonService } from './../../../shared/csv-to-json.service';
import { UserService } from '../../shared/user.service';

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
  loading = false;

  // Pre upload users errors
  uploadMsg: string;

  // Table structure
  listOfColumns = {};
  _listOfColumns: any;
  listOfData: [];
  editCache: { [key: string]: { edit: boolean; data: unknown } } = {};

  constructor(
    private csvToJsonService: CsvToJsonService,
    private userService: UserService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.uploadMsg = '';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  beforeUpload = (file: UploadFile) => {
    this.uploadMsg = '';
    return new Observable((observer: Observer<boolean>) => {
      const isCsv = file.type === 'application/vnd.ms-excel' || 'text/csv';
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

    if (this.csv) {
      this.csvToJsonService.csvJSON(this.csv, 'users').subscribe(
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
      'users',
      this._listOfColumns,
      this.editCache[index].data
    );
    Object.assign(this.listOfData[index], this.editCache[id].data);
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

  createUsers(): void {
    this.loading = true;
    let errors = false;

    // // Check errors
    this.listOfData.forEach((data) => {
      this._listOfColumns.forEach((column) => {
        if (column === 'grades') {
          Object.keys(data[column]['value']).forEach((grade) => {
            if (!data[column]['value'][grade]['isValid']) errors = true;
          });
        } else {
          if (!data[column]['isValid']) errors = true;
        }
      });
    });

    if (errors) {
      this.loading = false;
      this.notification.create(
        'error',
        'No se puede proceder con la carga de datos.',
        'Se han detectado errores dentro del contenido de la tabla. Por favor corríjalos para continuar.',
        {
          nzDuration: 0
        }
      );
    } else {
      this.createAdministrativeUsers();
    }
  }

  createAdministrativeUsers(): void {
    this.userService.createUsers(this.listOfData).subscribe(
      () => {
        this.message.success('Usuarios creados con éxito');
        this.clearScreen();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.message.warning(
          'Se encontraron errores en algunos registros, si desea subirlos corríjalos e intente nuevamente.',
          { nzDuration: 4500 }
        );
        this.clearListofData(error.message);
      }
    );
  }

  clearListofData(error): void {
    const listToDelete = new Array<number>();

    for (let i = this.listOfData.length - 1; i >= 0; i--) {
      const dat = Object.keys(this.listOfData)[i];

      if (error.hasOwnProperty(i)) {
        this.listOfData[dat]['inlineError'] = error[i].message;
      } else {
        listToDelete.push(this.listOfData[dat].id);
        this.listOfData[dat]['inlineError'] = null;
      }
    }

    listToDelete.forEach((id) => {
      this.listOfData = JSON.parse(JSON.stringify(this.listOfData.filter((d) => d['id'] !== id)));
    });
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
