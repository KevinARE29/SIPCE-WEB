import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-responsible-interview',
  templateUrl: './responsible-interview.component.html',
  styleUrls: ['./responsible-interview.component.css']
})
export class ResponsibleInterviewComponent implements OnInit {
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
