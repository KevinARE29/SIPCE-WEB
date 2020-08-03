import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Student } from '../../shared/student.model';
import { Responsible } from '../../shared/responsible.model';
import { StudentService } from '../../shared/student.service';
import { ShiftPeriodGrade } from '../../../manage-academic-catalogs/shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  student: Student;
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute, private studentService: StudentService) {}

  ngOnInit(): void {
    this.student = new Student();
    this.validateRouteParam();
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
        this.router.navigateByUrl('/estudiantes/' + param + '/detalle', { skipLocationChange: true });
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

    this.studentService.getStudent(this.student.id).subscribe((data) => {
      this.student = data;
      this.loading = false;
    });
  }
}
