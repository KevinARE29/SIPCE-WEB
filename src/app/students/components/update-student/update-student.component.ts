import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Student } from '../../shared/student.model';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Responsible } from '../../shared/responsible.model';
import { ResponsibleService } from '../../shared/responsible.service';
import { StudentStatus } from './../../../shared/student-status.enum';
import { KinshipRelationship } from './../../../shared/kinship-relationship.enum';
import { Observable, Observer } from 'rxjs';
import { Grade } from 'src/app/shared/grade.model';
import { StudentService } from '../../shared/student.service';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
  loading = false;
  imgLoader = false;

  // Form variables
  btnLoading = false;
  student: Student;
  studentForm!: FormGroup;
  responsibleForm!: FormGroup;
  results: Student[];
  noResults: string;
  searching = false;

  // Select lists
  shifts: ShiftPeriodGrade[];
  kinshipRelationships: any;
  activeGrades: Grade[];
  allGrades: Grade[];
  status: string[];

  // Table
  editCache: { [key: number]: { edit: boolean; data: Responsible } } = {};

  // Modals
  confirmModal?: NzModalRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private responsibleService: ResponsibleService,
    private studentService: StudentService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.init();
    this.student = new Student();
    this.results = new Array<Student>();
    this.kinshipRelationships = Object.keys(KinshipRelationship).filter((k) => isNaN(Number(k)));
    this.status = Object.keys(StudentStatus).filter((k) => isNaN(Number(k)));

    this.validateRouteParam();
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
      status: ['', [Validators.required]],
      shift: ['', [Validators.required]],
      currentGrade: ['', [Validators.required]],
      registrationGrade: ['', [Validators.required]],
      registrationYear: ['', [Validators.required]],
      searchSibling: ['']
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
  }

  getStudentData(): void {
    this.loading = true;
    this.student.shift = new ShiftPeriodGrade();
    this.student.startedGrade = new ShiftPeriodGrade();
    this.student.cycle = new ShiftPeriodGrade();
    this.student.grade = new ShiftPeriodGrade();
    this.student.section = new ShiftPeriodGrade();
    this.student.responsibles = new Array<Responsible>();
    this.student.siblings = new Array<Student>();
    this.student.images = new Array<unknown>();

    this.studentService.mergeStudentAndCatalogs(this.student.id).subscribe((data) => {
      this.student = data['student'];
      // console.log(data);
      // Grades data
      this.activeGrades = data['grades'].data.filter((x) => x.active === true);
      this.allGrades = data['grades'].data;

      // Shifts data
      this.shifts = data['shifts'].data.filter((x) => x.active === true);

      // Set student form data
      this.studentForm.get('code')?.setValue(this.student.code);
      this.studentForm.get('firstname')?.setValue(this.student.firstname);
      this.studentForm.get('lastname')?.setValue(this.student.lastname);
      this.studentForm.get('email')?.setValue(this.student.email);
      this.studentForm.get('dateOfBirth')?.setValue(this.student.birthdate);
      this.studentForm.get('shift')?.setValue(this.student.shift.id);
      this.studentForm.get('status')?.setValue(this.student.status);
      this.studentForm.get('currentGrade')?.setValue(this.student.grade.id);
      this.studentForm.get('registrationYear')?.setValue(new Date(this.student.registrationYear, 0, 1));
      this.studentForm.get('registrationGrade')?.setValue(this.student.startedGrade.id);

      // Add cache elements to responsibles table
      this.updateEditCache();

      // Transform images
      const images = new Array<unknown>();
      for (let i = this.student.startedGrade.id; i <= this.student.grade.id; i++) {
        const img = this.student.images.find((x) => x['title'] === this.allGrades[i - 1].name);

        img
          ? images.push({
              id: i,
              path: img['path'] ? img['path'] : img['image'],
              title: img['title'],
              grade: this.allGrades[i - 1].id
            })
          : images.push({ id: i, path: null, title: this.allGrades[i].name, grade: this.allGrades[i - 1].id });
      }

      this.student.images = images;

      this.loading = false;
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

  back(): void {
    this.location.back();
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  disabledYear = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 365;
  };
  //#endregion Initialize component

  //#region Update general information
  submitForm(): void {
    for (const i in this.studentForm.controls) {
      this.studentForm.controls[i].markAsDirty();
      this.studentForm.controls[i].updateValueAndValidity();
    }

    if (this.studentForm.valid) {
      // Student
      this.student.code = this.studentForm.controls['code'].value;
      this.student.firstname = this.studentForm.controls['firstname'].value;
      this.student.lastname = this.studentForm.controls['lastname'].value;
      this.student.email = this.studentForm.controls['email'].value;
      this.student.birthdate = this.studentForm.controls['dateOfBirth'].value;
      this.student.shift.id = this.studentForm.controls['shift'].value;
      this.student.grade.id = this.studentForm.controls['currentGrade'].value;
      this.student.startedGrade.id = this.studentForm.controls['registrationGrade'].value;
      this.student.registrationYear = this.studentForm.controls['registrationYear'].value;

      // this.updateStudent(); // TODO: Create method
    }
  }

  confirmDeleteSibling(id: number): void {
    this.student.siblings = this.student.siblings.filter((d) => d['id'] !== id);
  }

  searchSibling(): void {
    const search = new Student();
    search.code = this.studentForm.controls['searchSibling'].value;
    this.searching = !this.searching;

    if (search.code !== this.student.code && this.searching) {
      this.studentService.getStudents(null, search, true, null).subscribe((r) => {
        this.results = r['data'];
      });
    } else if (!this.searching) {
      this.results = new Array<Student>();
      this.studentForm.get('searchSibling')?.setValue(null);
    }
  }

  addSibling(sibling: Student): void {
    this.student.siblings.push(sibling);
    this.results = this.results.filter((d) => d['id'] !== sibling.id);
  }

  updateStudent(): void {
    this.studentService.updateStudent(this.student).subscribe(
      () => {
        this.message.success('Estudiante actualizado con éxito');
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al actualizar al estudiante. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 0 }
          );
        }
      }
    );
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

  handleChange(info: { file: UploadFile }, grade: number): void {
    this.uploadImage(info, grade);
  }

  uploadImage = (info: { file: UploadFile }, grade: number): void => {
    const img: Blob = info.file.originFileObj;
    if (img) {
      this.imgLoader = true;
      this.studentService.createOrUpdatePicture(this.student.id, grade, img).subscribe((r) => {
        const index = this.student.images.findIndex((item) => item['id'] === grade);
        this.student.images[index]['path'] = r.path;
        this.imgLoader = false;
      });
    }
  };
  //#endregion Student images
}