import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Student } from '../../shared/student.model';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Responsible } from '../../shared/responsible.model';
import { ResponsibleService } from '../../shared/responsible.service';
import { KinshipRelationship } from './../../../shared/kinship-relationship.enum';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
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
    this.student.responsibles.forEach((item) => {
      this.editCache[item['id']] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  /*****    Update general information   *****/
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

  /*****    Responsible methods   *****/
  // Delete responsible
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

  // Update responsible
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
  }

  saveEdit(id: number): void {
    const index = this.student.responsibles.findIndex((item) => item['id'] === id);

    if (this.validateNotNulls(this.editCache[id].data)) {
      if (/^[0-9]{8}$/.test(this.editCache[id].data.phone)) {
        this.responsibleService.updateResponsible(this.student.id, this.editCache[id].data).subscribe(
          () => {
            Object.assign(this.student.responsibles[index], this.editCache[id].data);
            this.editCache[id].edit = false;
            this.message.success('Responsable actualizado con éxito');
          },
          (error) => {
            if (error.status < 500 && error.status !== 404 && error.status !== 403) {
              this.notification.create(
                'error',
                'Ocurrió un error al actualizar al responsable Por favor verifique lo siguiente:',
                error.message,
                { nzDuration: 0 }
              );
            }
          }
        );
      } else {
        this.notification.create('warning', 'Formato incorrecto.', 'El número de teléfono debe contener 8 dígitos.', { nzDuration: 0 });
      }
    } else {
      this.notification.create('warning', 'Campos vacíos.', 'Todos los campos son obligatorios.', { nzDuration: 0 });
    }
  }

  validateNotNulls(obj: any): boolean {
    let valid = true;

    Object.values(obj).forEach((o) => {
      if (!o) valid = false;
      else if (o.toString().length <= 0) valid = false;
    });

    return valid;
  }

  /***************************************************IMAGES */
  fileList: UploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error'
    }
  ];
}
