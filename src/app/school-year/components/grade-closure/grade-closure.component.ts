import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { History } from 'src/app/history/shared/history.model';
import { HistoryService } from 'src/app/history/shared/history.service';
import { StudentService } from 'src/app/students/shared/student.service';
import { UserService } from 'src/app/users/shared/user.service';

export interface Grade {
  name: string;
  id: number;
}

export interface Student {
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
  students: Student[] = [];

  // Modal
  currentStudent: Student = null;
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
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    this.init();
    this.getProfile();
  }

  init(): void {
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

    this.conclusionForm = this.fb.group({
      conclusion: [null, Validators.required]
    });
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
          // const grade = assignation['shift']['id'].toString().concat(';', assignation['grade']['id']);
          this.teacherAssignation.push({ name, id: assignation['grade']['id'] });
        });

        if (this.teacherAssignation.length === 1) {
          this.currentGrade = this.teacherAssignation[0].id;
          // this.getStudents();
        }

        this.loading = false;
      }
    });
  }

  getStudents(): void {
    if (this.currentGrade) {
      this.studentService.getStudentResumes(this.currentGrade).subscribe((data) => {
        console.log(data['data']);
        this.progress = data['data']['progress'];
        this.students = data['data']['students'];
      });
    }
  }

  openModal(student: Student): void {
    this.modalTitle = `Comentario final para {{ student.firstname }} {{ student.lastname }}`;
    this.currentStudent = student;

    if (student.behavioralHistory.finalConclusion) {
      this.conclusionForm.setValue({
        conclusion: student.behavioralHistory.finalConclusion
      });
    }

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

        this.message.success(`El comentario final se ha actualizado con éxito`);

        this.isConfirmLoading = false;
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
      }
    );
  }
}
