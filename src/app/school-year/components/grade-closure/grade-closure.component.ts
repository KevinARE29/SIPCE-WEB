import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { StudentStatus } from './../../../shared/student-status.enum';
import { History } from 'src/app/history/shared/history.model';
import { HistoryService } from 'src/app/history/shared/history.service';
import { StudentService } from 'src/app/students/shared/student.service';
import { UserService } from 'src/app/users/shared/user.service';
import { Student } from 'src/app/students/shared/student.model';
import { SchoolYearService } from '../../shared/school-year.service';

export interface Grade {
  id: number;
  name: string;
  sectionId: number;
}

export interface StudentHistory {
  id: number;
  firstname: string;
  lastname: string;
  status: string;
  behavioralHistory: History;
}

@Component({
  selector: 'app-grade-closure',
  templateUrl: './grade-closure.component.html',
  styleUrls: ['./grade-closure.component.css']
})
export class GradeClosureComponent implements OnInit {
  loading = false;
  btnLoading = false;
  teacherAssignation: Grade[] = [];
  currentGrade: number;

  // Table
  listOfColumn = [];
  progress: number;
  students: StudentHistory[] = [];
  status: string[] = [];

  // Modal
  currentStudent: StudentHistory = null;
  modalTitle: string;
  isVisible = false;
  conclusionForm!: FormGroup;
  isConfirmLoading = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private userService: UserService,
    private studentService: StudentService,
    private schoolYearService: SchoolYearService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    this.init();
    this.getProfile();
  }

  init(): void {
    this.status = Object.keys(StudentStatus).filter((k) => isNaN(Number(k)));

    this.conclusionForm = this.fb.group({
      conclusion: [null, Validators.required]
    });

    this.listOfColumn = [
      {
        title: 'Nombre',
        compare: (a: unknown, b: unknown) => a['firstname'].localeCompare(b['firstname']),
        priority: 1
      },
      {
        title: 'Apellido',
        compare: (a: unknown, b: unknown) => a['lastname'].localeCompare(b['lastname']),
        priority: 2
      }
    ];
  }

  getProfile(): void {
    this.loading = true;

    this.userService.getUserProfile().subscribe((data) => {
      if (data['teacherAssignation']) {
        Object.values(data['teacherAssignation']).forEach((assignation) => {
          const name = assignation['grade']['name'].concat(
            ' ',
            assignation['section']['name'],
            ' (',
            assignation['shift']['name'],
            ')'
          );

          this.teacherAssignation.push({
            name,
            id: assignation['grade']['id'],
            sectionId: assignation['sectionDetailId']
          });
        });

        if (this.teacherAssignation.length === 1) {
          this.currentGrade = this.teacherAssignation[0].id;
          this.getStudents();
        }

        this.loading = false;
      }
    });
  }

  getStudents(): void {
    if (this.currentGrade) {
      this.loading = true;
      this.studentService.getStudentResumes(this.currentGrade).subscribe((data) => {
        this.loading = false;
        this.progress = data['data']['progress'];
        this.students = data['data']['students'];
      });
    }
  }

  openModal(student: StudentHistory): void {
    this.modalTitle = `Comentario final para ${student.firstname} ${student.lastname}`;
    this.currentStudent = student;

    this.conclusionForm.setValue({
      conclusion: student.behavioralHistory.finalConclusion
    });

    this.isVisible = true;
  }

  handleOk(): void {
    const conclusionControl = this.conclusionForm.controls['conclusion'];

    // Display errors if needed
    conclusionControl.markAsDirty();
    conclusionControl.updateValueAndValidity();

    if (this.conclusionForm.valid) {
      this.currentStudent.behavioralHistory.finalConclusion = this.conclusionForm.controls['conclusion'].value;
      this.finalConclusion();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.currentStudent = null;
    this.conclusionForm.reset();
  }

  finalConclusion(): void {
    this.isConfirmLoading = true;
    this.historyService.updateHistory(this.currentStudent.id, this.currentStudent.behavioralHistory).subscribe(
      () => {
        const id = this.students.findIndex((x) => x.id === this.currentStudent.id);
        this.students[id].behavioralHistory.finalConclusion = this.currentStudent.behavioralHistory.finalConclusion;

        this.message.success(
          `El comentario final de ${this.currentStudent.firstname} ${this.currentStudent.lastname} se ha actualizado con éxito`
        );

        const answered = this.students.filter((x) => x.behavioralHistory.finalConclusion !== null);
        const total = this.students.length;

        this.progress = answered.length / total;

        this.isConfirmLoading = false;

        this.handleCancel();
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        this.isConfirmLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al intentar actualizar el comentario final.',
            error.message,
            {
              nzDuration: 30000
            }
          );
        }

        this.handleCancel();
      }
    );
  }

  updateStudentStatus(status: string, student: StudentHistory): void {
    const _student = new Student();
    _student.id = student.id;
    _student.status = status;

    this.studentService.updateStudent(_student).subscribe(() => {
      this.message.success(`El estado de ${student.firstname} ${student.lastname} se ha actualizado con éxito`);
    });
  }

  close(): void {
    const grade = this.teacherAssignation.filter((x) => x.id === this.currentGrade)[0];

    this.schoolYearService.closeSection(grade.sectionId).subscribe(
      () => {
        this.message.success(`Se ha cerrado con éxito el año escolar para ${grade.name}`);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        this.isConfirmLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar cerrar el año escolar.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
