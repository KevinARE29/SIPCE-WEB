import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { StudentService } from 'src/app/students/shared/student.service';
import { FoulsSanctionsService } from '../../shared/fouls-sanctions.service';
import { Student } from 'src/app/students/shared/student.model';
import { History } from '../../shared/history.model';
import { FoulsCounter } from '../../shared/fouls-counter.model';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit, OnChanges {
  @Input() id: number;
  @Input() history: History;
  @Input() showAlert: boolean;

  // Student data
  student: Student;
  loadingStudent = true;

  // Fouls alert.
  counters: FoulsCounter[];
  showCounterAlert: boolean;
  loadingCounters = false;
  showModal = false;

  constructor(private studentService: StudentService, private foulsService: FoulsSanctionsService) {}

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

  ngOnChanges(): void {
    if (this.showAlert) {
      this.getCounter();
    }
  }

  setShowModal(show: boolean): void {
    this.showModal = show;
  }

  getCounter(): void {
    this.loadingCounters = true;
    this.showCounterAlert = false;
    this.foulsService.getFoulsCounter(this.id, this.history.id).subscribe((result) => {
      this.counters = result;
      this.showCounterAlert = this.counters.some((r) => r.displayAlert);
      this.loadingCounters = false;
    });
  }
}
