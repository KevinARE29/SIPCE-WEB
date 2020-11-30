import { Component, Input, OnInit } from '@angular/core';

import { StudentService } from 'src/app/students/shared/student.service';
import { Student } from 'src/app/students/shared/student.model';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {
  @Input() id: number;

  // Student data
  student: Student;
  loadingStudent = true;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // To avoid errors while loading.
    this.student = new Student();
    this.student.siblings = [];
    this.student.responsibles = [];

    this.studentService.getStudent(this.id).subscribe((student) => {
      this.student = student;
      this.loadingStudent = false;
    });
  }
}
