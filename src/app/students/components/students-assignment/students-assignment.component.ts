import { Component, OnInit } from '@angular/core';

import { Student } from '../../shared/student.model';
import { StudentService } from '../../shared/student.service';
import { UserService } from 'src/app/users/shared/user.service';

export interface Data {
  student: Student;
  disabled: boolean;
}

@Component({
  selector: 'app-students-assignment',
  templateUrl: './students-assignment.component.html',
  styleUrls: ['./students-assignment.component.css']
})
export class StudentsAssignmentComponent implements OnInit {
  loading = false;

  // Tables variables
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
    // this.getStudents();
    this.getProfile();
  }

  getProfile(): void {
    this.userService.getUserProfile().subscribe((data) => {
      console.log(data);
    });
  }

  getStudents(): void {
    this.loading = true;
    this.studentService.getStudentsAssignation(7, 1).subscribe((data) => {
      console.log(data);
      this.studentsWithoutAssignation = data['studentsWithoutAssignation'];
      this.assignedStudents = data['assignedStudents'];
      this.myStudents = data['myStudents'];

      this.loading = false;
    });
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
    console.log('Search', this.searchParams);
    switch (list) {
      case 'availables':
        this.studentsWithoutAssignation = this.studentsWithoutAssignation.filter((x) => {
          if (this.searchParams.code) x.student.code === this.searchParams.code;
          if (this.searchParams.firstname) x.student.firstname === this.searchParams.firstname;
          if (this.searchParams.lastname) x.student.lastname === this.searchParams.lastname;
          return x;
        });
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

  //   this.userService.generateCredentials(Array.from(this.setOfCheckedId)).subscribe(
  //     () => {
  //       this.search();
  //       this.isVisible = false;
  //       this.isConfirmLoading = false;
  //       this.loading = false;
  //       this.setOfCheckedId.clear();
  //       this.refreshCheckedStatus();
  //       this.message.success('Credenciales generadas con éxito');
  //     },
  //     (error) => {
  //       this.isVisible = false;
  //       this.isConfirmLoading = false;
  //       this.loading = false;

  //       const statusCode = error.statusCode;
  //       const notIn = [401, 403];

  //       if (!notIn.includes(statusCode) && statusCode < 500) {
  //         this.notification.create('error', 'Ocurrió un error al crear las credenciales.', error.message, {
  //           nzDuration: 0
  //         });
  //       }
  //     }
  //   );
  // }
  //#endregion
}
