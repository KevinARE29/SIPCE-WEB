import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Student } from '../../shared/student.model';
import { UploadFile } from 'ng-zorro-antd/upload';

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
  studentForm!: FormGroup;

  // Select lists
  shifts: ShiftPeriodGrade[];

  constructor(private fb: FormBuilder, private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.init();
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

  getShifts(): void {
    this.shiftService.getShifts().subscribe((data) => {
      this.shifts = data['data'].filter((x) => x.active === true);
    });
  }

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
