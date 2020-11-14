import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-session',
  templateUrl: './student-session.component.html',
  styleUrls: ['./student-session.component.css']
})
export class StudentSessionComponent implements OnInit {
  // Param.
  studentId: number;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const param = this.route.snapshot.params['student'];

    if (typeof param === 'string' && !Number.isNaN(Number(param))) {
      this.studentId = Number(param);
    } 
  }

}
