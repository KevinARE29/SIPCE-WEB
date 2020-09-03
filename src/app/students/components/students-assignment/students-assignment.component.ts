import { Component, OnInit } from '@angular/core';

import { Student } from '../../shared/student.model';
import { StudentService } from '../../shared/student.service';
import { UserService } from 'src/app/users/shared/user.service';

export interface Data {
  student: Student;
  disabled: boolean;
}

export interface Grade {
  name: string;
  ids: string;
}

@Component({
  selector: 'app-students-assignment',
  templateUrl: './students-assignment.component.html',
  styleUrls: ['./students-assignment.component.css']
})
export class StudentsAssignmentComponent implements OnInit {
  loading = false;
  firstLoad = false;
  teacherAssignation: Grade[] = [];
  currentGrade: string;

  // Tables variables
  dataTables: { availables: Data[]; assigned: Data[]; students: Data[] };
  assignedStudents: Data[] = [];
  studentsWithoutAssignation: Data[] = [];
  myStudents: Student[] = [];

  // Shared variables
  searchParams: Student;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: Data[] = [];
  filteredList: Data[] = [];

  // Table columns
  availableColumns = [];
  assignedColumns = [];
  myStudentsColumns = [];

  constructor(private studentService: StudentService, private userService: UserService) {}

  ngOnInit(): void {
    this.searchParams = new Student();
    this.searchParams.code = null;
    this.searchParams.firstname = null;
    this.searchParams.lastname = null;

    this.initializeColumns();
    this.getProfile();
  }

  getProfile(): void {
    this.firstLoad = true;
    this.userService.getUserProfile().subscribe((data) => {
      Object.values(data['teacherAssignation']).forEach((assignation) => {
        const name = assignation['grade']['name'].concat(' (', assignation['shift']['name'], ')');
        const ids = assignation['shift']['id'].toString().concat(';', assignation['grade']['id']);
        this.teacherAssignation.push({ name, ids });
      });

      if (this.teacherAssignation.length === 1) {
        this.currentGrade = this.teacherAssignation[0].ids;
        this.getStudents();
      }

      this.firstLoad = false;
    });
  }

  getStudents(): void {
    if (this.currentGrade) {
      const ids = this.currentGrade.split(';');
      this.loading = true;

      this.studentService.getStudentsAssignation(parseInt(ids[0]), parseInt(ids[1])).subscribe((data) => {
        this.studentsWithoutAssignation = data['studentsWithoutAssignation'];
        this.assignedStudents = data['assignedStudents'];
        this.myStudents = data['myStudents'];

        // Contains the copy of the original lists
        this.dataTables = {
          availables: data['studentsWithoutAssignation'],
          assigned: data['assignedStudents'],
          students: data['myStudents']
        };

        this.loading = false;
      });
    } else {
      this.studentsWithoutAssignation = [];
      this.assignedStudents = [];
      this.myStudents = [];
    }
  }

  initializeColumns(): void {
    this.availableColumns = [
      {
        title: 'NIE',
        compare: (a: Data, b: Data) => a.student.code.localeCompare(b.student.code),
        priority: 1
      },
      {
        title: 'Nombres',
        compare: (a: Data, b: Data) => a.student.firstname.localeCompare(b.student.firstname),
        priority: 2
      },
      {
        title: 'Apellidos',
        compare: (a: Data, b: Data) => a.student.lastname.localeCompare(b.student.lastname),
        priority: 3
      }
    ];
  }

  cleanTab(tab: string): void {
    console.log(tab);
    this.searchParams = new Student();
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();
    this.listOfCurrentPageData = [];
    this.filteredList = [];

    console.log(
      this.searchParams,
      this.checked,
      this.indeterminate,
      this.setOfCheckedId,
      this.listOfCurrentPageData,
      this.filteredList
    );
    switch (tab) {
      case 'availables':
        break;
      case 'assigned':
        break;
      case 'my students':
        break;
    }
  }

  search(list: string): void {
    const params = this.searchParams;

    switch (list) {
      case 'availables':
        this.studentsWithoutAssignation = this.dataTables.availables.filter(
          (x) =>
            (!params.code || x['student'].code.toLowerCase().includes(params.code.toLowerCase())) &&
            (!params.firstname || x['student'].firstname.toLowerCase().includes(params.firstname.toLowerCase())) &&
            (!params.lastname || x['student'].lastname.toLowerCase().includes(params.lastname.toLowerCase()))
        );
        break;
    }
  }

  //#region Selection & operations over table
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ student }) => this.setOfCheckedId.has(student.id));
    this.indeterminate = listOfEnabledData.some(({ student }) => this.setOfCheckedId.has(student.id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ student }) => this.updateCheckedSet(student.id, checked));
    this.refreshCheckedStatus();
  }

  // sendRequest(): void {
  //   this.loading = true;
  //   this.isConfirmLoading = true;
  // }
  //#endregion
}
