import { Component, OnInit } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import { differenceInCalendarDays } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UploadFile } from 'ng-zorro-antd/upload';

import DictionaryJson from './../../../../assets/dictionary.json';
import { CsvToJsonService } from 'src/app/shared/csv-to-json.service';
import { GradeService } from 'src/app/manage-academic-catalogs/shared/grade.service';
import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { StudentService } from '../../shared/student.service';

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
  grades: any[];
  shifts: any[];
  nextYear = false;
  year: number;
  filesHelp: string;

  // Pre upload users errors
  uploadMsg: string;
  shiftMsg: string;

  // Table structure
  listOfColumns: any;
  _listOfColumns: any;
  listOfData: [];
  editCache: { [key: string]: { edit: boolean; data: unknown } } = {};

  constructor(
    private csvToJsonService: CsvToJsonService,
    private gradeService: GradeService,
    private studentService: StudentService,
    private shiftService: ShiftService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.uploadMsg = '';
    this.shiftMsg = '';
    this.year = new Date().getFullYear() + 1;
    this.getAcademicCatalogs();

    this.filesHelp =
      'Encabezados esperados: NIE, Nombres, Apellidos, Correo electrónico, Fecha de nacimiento, Nombre del responsable, Apellido del responsable, Parentesco y Correo electrónico del responsable. Opcionales: Año de ingreso y Grado de ingreso';
  }

  getAcademicCatalogs(): void {
    this.shiftService.getShifts().subscribe((data) => {
      this.shifts = data['data'].filter((x) => x.active === true);
    });

    this.gradeService.getAllGrades().subscribe((data) => {
      this.grades = data['data'];
    });
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  beforeUpload = (file: UploadFile): Observable<any> => {
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
          if (r['data'].length > 0) {
            this._listOfColumns = JSON.parse(JSON.stringify(r['headers']));
            this.generateTable(r);
          } else {
            // TODO: Improve this code
            this.notification.create(
              'error',
              'Ocurrió un error al intentar cargar el archivo.',
              'Verifique que las columnas ingresadas correspondan a las esperadas. O que el archivo tenga datos.',
              {
                nzDuration: 30000
              }
            );

            this.listOfColumns = {};
            this._listOfColumns = null;
            this.listOfData = [];
            this.editCache = {};
          }
        },
        (error) => {
          this.notification.create('error', 'Ocurrió un error al intentar cargar el archivo.', error, {
            nzDuration: 30000
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

    this.listOfColumns = new Array<any>(r.headers);
    this.listOfData = r.data;

    this.validateGrades();
    this.updateEditCache();
  }

  validateGrades(): void {
    this.listOfData.forEach((data) => {
      const item: any[] = data['grade'];
      const prev: any[] = data['startedGrade'];

      if (item) {
        const found = this.grades.find((element) => element.name.toLowerCase() === item['value'].toLowerCase());
        if (found) {
          if (found.active) {
            item['grade'] = found;
            item['isValid'] = true;
            item['message'] = null;
          } else {
            item['grade'] = null;
            item['isValid'] = false;
            item['message'] = `El grado ${item['value']} no se encuentra activo.`;
          }
        } else {
          item['grade'] = null;
          item['isValid'] = false;
          item['message'] = `El grado ${item['value']} no existe en el sistema.`;
        }
      }

      if (prev) {
        const found = this.grades.find((element) => element.name.toLowerCase() === prev['value'].toLowerCase());
        if (found) {
          prev['grade'] = found;
          prev['isValid'] = true;
          prev['message'] = null;
        } else {
          prev['grade'] = null;
          prev['isValid'] = false;
          prev['message'] = `El grado ${prev['value']} no existe en el sistema.`;
        }
      }
    });
  }

  validateGrade(data): void {
    const item: any[] = data['grade'];
    const prev: any[] = data['startedGrade'];

    if (item) {
      const found = this.grades.find((element) => element.name.toLowerCase() === item['value'].toLowerCase());
      if (found) {
        if (found.active) {
          item['grade'] = found;
          item['isValid'] = true;
          item['message'] = null;
        } else {
          item['grade'] = null;
          item['isValid'] = false;
          item['message'] = `El grado ${item['value']} no se encuentra activo.`;
        }
      } else {
        item['grade'] = null;
        item['isValid'] = false;
        item['message'] = `El grado ${item['value']} no existe en el sistema.`;
      }
    }

    if (prev) {
      const found = this.grades.find((element) => element.name.toLowerCase() === prev['value'].toLowerCase());
      if (found) {
        prev['grade'] = found;
        prev['isValid'] = true;
        prev['message'] = null;
      } else {
        prev['grade'] = null;
        prev['isValid'] = false;
        prev['message'] = `El grado ${prev['value']} no existe en el sistema.`;
      }
    }
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
    this.validateGrade(this.editCache[index].data);
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

  createStudents(): void {
    this.loading = true;
    let errors = false;
    // Check errors
    this.listOfData.forEach((data) => {
      this._listOfColumns.forEach((column) => {
        if (column === 'role') {
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
          nzDuration: 30000
        }
      );
    } else {
      this.bulkStudents();
    }
  }

  bulkStudents(): void {
    this.studentService.bulkStudents(this.listOfData, this.shift, !this.nextYear).subscribe(
      () => {
        this.message.success('Estudiantes creados con éxito');
        this.clearScreen();
        this.loading = false;
      },
      (error) => {
        const notIn = [401, 403];
        this.loading = false;

        if (!notIn.includes(error.statusCode) && error.statusCode < 500) {
          this.message.warning(
            'Se encontraron errores en algunos registros, si desea subirlos corríjalos e intente nuevamente.',
            { nzDuration: 30000 }
          );
        }

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
