import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit {
  studentId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }
  }
}
