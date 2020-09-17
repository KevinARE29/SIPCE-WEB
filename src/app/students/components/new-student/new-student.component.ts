import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Student } from '../../shared/student.model';
import { Responsible } from '../../shared/responsible.model';
import { KinshipRelationship } from './../../../shared/kinship-relationship.enum';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { GradeService } from 'src/app/manage-academic-catalogs/shared/grade.service';
import { StudentService } from '../../shared/student.service';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css']
})
export class NewStudentComponent implements OnInit {
  loading = false;
  // Form variables
  btnLoading = false;
  studentForm!: FormGroup;
  student: Student;
  responsible: Responsible;

  // Select lists
  activeGrades: ShiftPeriodGrade[];
  allGrades: ShiftPeriodGrade[];
  shifts: ShiftPeriodGrade[];
  kinshipRelationships: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shiftService: ShiftService,
    private gradeService: GradeService,
    private studentService: StudentService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.student = new Student();
    this.responsible = new Responsible();

    this.student.shift = new ShiftPeriodGrade();
    this.student.grade = new ShiftPeriodGrade();
    this.student.startedGrade = new ShiftPeriodGrade();
    this.student.responsibles = new Array<Responsible>();
    this.kinshipRelationships = Object.keys(KinshipRelationship).filter((k) => isNaN(Number(k)));

    this.init();
    this.getGrades();
    this.getShifts();
  }

  init(): void {
    // eslint-disable-next-line prettier/prettier
    const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const phonePattern = new RegExp(/^[267]{1}[0-9]{3}[-]{1}[0-9]{4}$/);

    this.studentForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      firstname: [
        '',
        [Validators.required, Validators.maxLength(64), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
      ],
      lastname: [
        '',
        [Validators.required, Validators.maxLength(64), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
      ],
      email: ['', [Validators.required, Validators.maxLength(128), Validators.pattern(emailPattern)]],
      dateOfBirth: ['', [Validators.required]],
      shift: ['', [Validators.required]],
      currentGrade: ['', [Validators.required]],
      registrationGrade: [''],
      registrationYear: [''],
      responsibleFirstname: [
        '',
        [Validators.required, Validators.maxLength(64), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
      ],
      responsibleLastname: [
        '',
        [Validators.required, Validators.maxLength(64), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
      ],
      responsibleEmail: ['', [Validators.required, Validators.maxLength(128), Validators.pattern(emailPattern)]],
      responsiblePhone: ['', [Validators.required, Validators.pattern(phonePattern)]],
      responsibleRelationship: ['', Validators.required]
    });
  }

  getGrades(): void {
    this.gradeService.getAllGrades().subscribe((data) => {
      this.activeGrades = data['data'].filter((x) => x.active === true);
      this.allGrades = data['data'];
    });
  }

  getShifts(): void {
    this.shiftService.getShifts().subscribe((data) => {
      this.shifts = data['data'].filter((x) => x.active === true);
    });
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  disabledYear = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 365;
  };

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
      // Responsible
      this.responsible.firstname = this.studentForm.controls['responsibleFirstname'].value;
      this.responsible.lastname = this.studentForm.controls['responsibleLastname'].value;
      this.responsible.email = this.studentForm.controls['responsibleEmail'].value;
      this.responsible.phone = this.studentForm.controls['responsiblePhone'].value;
      this.responsible.relationship = this.studentForm.controls['responsibleRelationship'].value;
      this.student.responsibles.push(this.responsible);
      // Optional fields
      this.student.startedGrade.id = this.studentForm.controls['registrationGrade'].value;
      this.student.registrationYear = this.studentForm.controls['registrationYear'].value;

      this.createStudent();
    }
  }

  createStudent(): void {
    this.studentService.createStudent(this.student).subscribe(
      (r) => {
        this.message.success(`El estudiante ${this.student.firstname} ${this.student.lastname} ha sido creado`);
        // this.router.navigate['estudiantes/consultar'];
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
