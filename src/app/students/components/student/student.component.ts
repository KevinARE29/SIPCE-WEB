import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Student } from '../../shared/student.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  student: Student;
  images: any[];
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.student = new Student();
    this.images = new Array<any[]>();
    this.init();
  }

  init(): void {
    this.route.paramMap.subscribe((params) => {
      const param: string = params.get('student');
      let id;

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        id = Number(param);

        if (id === 0) {
          this.router.navigateByUrl('/estudiantes/nuevo');
        } else if (id > 0) {
          this.student.id = id;
          this.getStudent();
        }
      } else {
        this.router.navigateByUrl('/usuario/' + param, { skipLocationChange: true });
      }
    });

    for (let i = 0; i < 10; i++) {
      this.images.push({ title: `Image ${i}`, image: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' });
    }
  }

  getStudent(): void {
    // TODO: Get student
  }
}
