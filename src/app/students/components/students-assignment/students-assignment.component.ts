import { Component, OnInit } from '@angular/core';

import { Student } from '../../shared/student.model';

@Component({
  selector: 'app-students-assignment',
  templateUrl: './students-assignment.component.html',
  styleUrls: ['./students-assignment.component.css']
})
export class StudentsAssignmentComponent implements OnInit {
  searchParams: Student;
  constructor() {}

  ngOnInit(): void {
    this.searchParams = new Student();
  }

  cleanTab(tab: string): void {
    console.log(tab);
    this.searchParams = new Student();

    switch (tab) {
      case 'availables':
        break;
      case 'assigned':
        break;
      case 'my students':
        break;
    }
  }

  search(): void {
    console.log('Search');
  }
}
