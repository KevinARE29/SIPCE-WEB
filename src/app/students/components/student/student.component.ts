import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Student } from '../../shared/student.model';
import { ResponsibleService } from '../../shared/responsible.service';
import { Responsible } from '../../shared/responsible.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  student: Student;
  images: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private studentService: StudentComponent,
    private responsibleService: ResponsibleService
  ) {}

  ngOnInit(): void {
    this.student = new Student();
    this.images = new Array<any[]>();
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

    for (let i = 0; i < 10; i++) {
      this.images.push({ title: `Image ${i}`, image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' });
    }
  }

  getStudentData(): void {
    this.student.responsibles = new Array<Responsible>();
    // TODO: Get student data
    // this.responsibleService.getResponsibles(this.student.id).subscribe((data) => {
    //   this.student.responsibles = data['data'];
    // });
  }
}
