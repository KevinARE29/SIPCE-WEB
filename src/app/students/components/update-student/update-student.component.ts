import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Student } from '../../shared/student.model';
import { UploadFile, UploadFileStatus } from 'ng-zorro-antd/upload';
import { Responsible } from '../../shared/responsible.model';
import { ResponsibleService } from '../../shared/responsible.service';
import { KinshipRelationship } from './../../../shared/kinship-relationship.enum';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
  avatarUrl: any; // TODO: Delete
  loading = false;
  // Form variables
  btnLoading = false;
  student: Student;
  images: any[];
  studentForm!: FormGroup;
  responsibleForm!: FormGroup;

  // Select lists
  shifts: ShiftPeriodGrade[];
  kinshipRelationships: any;

  // Table
  editCache: { [key: number]: { edit: boolean; data: Responsible } } = {};

  // Modals
  confirmModal?: NzModalRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private responsibleService: ResponsibleService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.init();
    this.student = new Student();
    this.images = new Array<any[]>();
    this.kinshipRelationships = Object.keys(KinshipRelationship).filter((k) => isNaN(Number(k)));

    this.validateRouteParam();
    // this.getShifts();
  }

  //#region Initialize component
  init(): void {
    // eslint-disable-next-line prettier/prettier
    const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    this.studentForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(32)]],
      firstname: ['', [Validators.required, Validators.maxLength(128)]],
      lastname: ['', [Validators.required, Validators.maxLength(128)]],
      email: ['', [Validators.required, Validators.maxLength(128), Validators.pattern(emailPattern)]],
      dateOfBirth: ['', [Validators.required]],
      shift: ['', [Validators.required]],
      currentGrade: ['', [Validators.required]],
      registrationGrade: ['', [Validators.required]],
      registrationYear: ['', [Validators.required]]
    });
  }

  validateRouteParam(): void {
    this.route.paramMap.subscribe((params) => {
      const param: string = params.get('student');
      let id;

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        id = Number(param);

        if (id === 0) {
          this.router.navigateByUrl('/estudiantes/nuevo');
        } else if (id > 0) {
          this.student.id = id;
          this.getStudentData();
        }
      } else {
        this.router.navigateByUrl('/estudiantes/' + param + '/editar', { skipLocationChange: true });
      }
    });

    for (let i = 0; i < 10; i++) {
      this.images.push({ title: `Image ${i}`, image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' });
    }
  }

  getShifts(): void {
    this.shiftService.getShifts().subscribe((data) => {
      this.shifts = data['data'].filter((x) => x.active === true);
    });
  }

  getStudentData(): void {
    this.student.responsibles = new Array<Responsible>();
    // TODO: Get student data
    this.responsibleService.getResponsibles(this.student.id).subscribe((data) => {
      this.student.responsibles = data['data'];
      this.updateEditCache();
    });
  }

  updateEditCache(): void {
    this.editCache = {};
    this.student.responsibles.forEach((item) => {
      this.editCache[item['id']] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  //#endregion Initialize component

  //#region Update general information
  submitForm(): void {
    for (const i in this.studentForm.controls) {
      this.studentForm.controls[i].markAsDirty();
      this.studentForm.controls[i].updateValueAndValidity();
    }

    if (this.studentForm.valid) {
      // Student
      /*this.student.code = this.studentForm.controls['code'].value;
      this.student.firstname = this.studentForm.controls['firstname'].value;
      this.student.lastname = this.studentForm.controls['lastname'].value;
      this.student.email = this.studentForm.controls['email'].value;
      this.student.birthdate = this.studentForm.controls['dateOfBirth'].value;
      this.student.shift.id = this.studentForm.controls['shift'].value;
      this.student.grade.id = this.studentForm.controls['currentGrade'].value;
*/
      // Optional fields
      /*this.student.startedGrade.id = this.studentForm.controls['registrationGrade'].value;
      this.student.registrationYear = this.studentForm.controls['registrationYear'].value;
*/
      // this.updateStudent(); // TODO: Create method
    }
  }
  //#endregion Update general information

  //#region Responsibles
  // Delete
  showConfirm(id: number): void {
    if (this.student.responsibles.length > 1) {
      const element = this.student.responsibles.find((x) => x.id === id);

      this.confirmModal = this.modal.confirm({
        nzTitle: `¿Desea eliminar al responsable"?`,
        nzContent: `Eliminará de los responsables a ${element.firstname} ${element.lastname}, ${element.relationship} del alumno ${this.student.firstname} ${this.student.lastname}. La acción no puede deshacerse.`,

        nzOnOk: () =>
          this.responsibleService
            .deleteResponsible(this.student.id, element.id)
            .toPromise()
            .then(() => {
              this.student.responsibles = this.student.responsibles.filter((d) => d['id'] !== id);
              this.message.success(`El responsable ${element.firstname} ${element.lastname} ha sido eliminado`);
            })
            .catch((err) => {
              const statusCode = err.statusCode;
              const notIn = [401, 403];

              if (!notIn.includes(statusCode) && statusCode < 500) {
                this.notification.create('error', 'Ocurrió un error al eliminar al resposnsable.', err.message, {
                  nzDuration: 0
                });
              }
            })
      });
    } else {
      this.notification.create(
        'warning',
        'Un estudiante no puede quedar sin un adulto responsable.',
        'Para poder eliminar este registro debe crear un nuevo responsable.',
        { nzDuration: 0 }
      );
    }
  }

  // Update
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.student.responsibles.findIndex((item) => item['id'] === id);
    const lastValue = this.student.responsibles[index];
    this.editCache[id] = {
      data: JSON.parse(JSON.stringify(lastValue)),
      edit: false
    };

    if (id === 0) {
      this.student.responsibles = this.student.responsibles.filter((d) => d['id'] !== id);
    }
  }

  updateResponsible(id: number): void {
    const index = this.student.responsibles.findIndex((item) => item['id'] === id);

    this.responsibleService.updateResponsible(this.student.id, this.editCache[id].data).subscribe(
      () => {
        Object.assign(this.student.responsibles[index], this.editCache[id].data);
        this.editCache[id].edit = false;
        this.message.success('Responsable actualizado con éxito');
      },
      (error) => {
        if (error.statusCode < 500 && error.statusCode !== 404 && error.statusCode !== 403) {
          this.notification.create(
            'error',
            'Ocurrió un error al actualizar al responsable Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 0 }
          );
        }
      }
    );
  }

  saveEdit(id: number): void {
    if (this.validateNotNulls(this.editCache[id].data)) {
      if (/^[0-9]{8}$/.test(this.editCache[id].data.phone)) {
        if (id > 0) this.updateResponsible(id);
        else this.createResponsible();
      } else {
        this.notification.create('warning', 'Formato incorrecto.', 'El número de teléfono debe contener 8 dígitos.', {
          nzDuration: 0
        });
      }
    } else {
      this.notification.create('warning', 'Campos vacíos.', 'Todos los campos son obligatorios.', { nzDuration: 0 });
    }
  }

  // Create
  addResponsible(): void {
    if (this.student.responsibles.length < 2) {
      this.student.responsibles = [
        ...this.student.responsibles,
        {
          id: 0,
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          relationship: ''
        }
      ];
      this.editCache[0] = {
        edit: true,
        data: {
          id: 0,
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          relationship: ''
        }
      };
    } else {
      this.notification.create(
        'warning',
        'Límite de responsables alcanzado',
        'Solo se permiten dos responsables por estudiante.',
        { nzDuration: 0 }
      );
    }
  }

  createResponsible(): void {
    const index = this.student.responsibles.findIndex((item) => item['id'] === 0);
    this.responsibleService.createResponsible(this.student.id, this.editCache[0].data).subscribe(
      (data) => {
        // Update register
        this.student.responsibles[index].id = data['data'].id;
        this.student.responsibles[index].firstname = data['data'].firstname;
        this.student.responsibles[index].lastname = data['data'].lastname;
        this.student.responsibles[index].email = data['data'].email;
        this.student.responsibles[index].phone = data['data'].phone;
        this.student.responsibles[index].relationship = this.editCache[0].data.relationship;

        this.updateEditCache();
        this.message.success('Responsable creado con éxito');
      },
      (error) => {
        if (error.statusCode < 500 && error.statustatusCodes !== 404 && error.statusCode !== 403) {
          this.notification.create(
            'error',
            'Ocurrió un error al actualizar al responsable Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 0 }
          );
        }
      }
    );
  }

  validateNotNulls(obj: any): boolean {
    let valid = true;

    Object.values(obj).forEach((o) => {
      if (!o && o !== 0) valid = false;
      else if (o.toString().length <= 0) valid = false;
    });

    return valid;
  }
  //#endregion Responsibles

  back(): void {
    this.location.back();
  }

  //#region Student images
  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/svg';

      if (!isJpgOrPng) {
        this.message.error('Solamente se permiten formatos de imagen jpg, jpeg, svg y png.');
        observer.complete();
        return;
      }
      const isLt5M = file.size! / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.message.error('La imagen debe pesar menos de 5MB');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt5M);
      observer.complete();
    });
  };

  getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    this.uploadImage(info);
  }

  uploadImage = (info: { file: UploadFile }): void => {
    const img: Blob = info.file.originFileObj;
    let url;
    if (img) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(img);

      reader.onload = () => {
        url = reader.result;
      };
      console.log(url);
    }
  };
  //#endregion Student images
}
