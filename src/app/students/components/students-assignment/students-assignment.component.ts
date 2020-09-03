import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  isConfirmLoading = false;
  linking = false;
  unlinking = false;
  firstLoad = false;
  teacherAssignation: Grade[] = [];
  currentGrade: string;
  currentTab: string;

  // Tables variables
  dataTables: { availables: Data[]; assigned: Data[]; students: Data[] };
  assignedStudents: Data[] = [];
  studentsWithoutAssignation: Data[] = [];
  myStudents: Data[] = [];

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

  constructor(
    private studentService: StudentService,
    private userService: UserService,
    private message: NzMessageService,
    // private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.currentTab = 'availables';

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
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();
    this.listOfCurrentPageData = [];
    this.filteredList = [];

    Object.keys(this.searchParams).forEach((key) => {
      this.searchParams[key] = null;
    });

    this.currentTab === tab ? this.search(tab) : (this.currentTab = tab);
  }

  search(list: string): void {
    const params = this.searchParams;

    if (this.dataTables) {
      switch (list) {
        case 'availables':
          this.studentsWithoutAssignation = this.dataTables.availables.filter(
            (x) =>
              (!params.code || x['student'].code.toLowerCase().includes(params.code.toLowerCase())) &&
              (!params.firstname || x['student'].firstname.toLowerCase().includes(params.firstname.toLowerCase())) &&
              (!params.lastname || x['student'].lastname.toLowerCase().includes(params.lastname.toLowerCase()))
          );
          break;
        // case 'assigned':
        //   this.assignedStudents = this.dataTables.assigned.filter(
        //     (x) =>
        //       (!params.code || x['student'].code.toLowerCase().includes(params.code.toLowerCase())) &&
        //       (!params.firstname || x['student'].firstname.toLowerCase().includes(params.firstname.toLowerCase())) &&
        //       (!params.lastname || x['student'].lastname.toLowerCase().includes(params.lastname.toLowerCase()))
        //   );
        //   break;
        // case 'my students':
        //   this.myStudents = this.dataTables.students.filter(
        //     (x) =>
        //       (!params.code || x['student'].code.toLowerCase().includes(params.code.toLowerCase())) &&
        //       (!params.firstname || x['student'].firstname.toLowerCase().includes(params.firstname.toLowerCase())) &&
        //       (!params.lastname || x['student'].lastname.toLowerCase().includes(params.lastname.toLowerCase()))
        //   );
        //   break;
      }
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

  linkStudents(): void {
    if (this.currentGrade) {
      const ids = this.currentGrade.split(';');
      this.loading = true;
      this.isConfirmLoading = true;

      this.studentService
        .updateStudentsAssignation(parseInt(ids[0]), parseInt(ids[1]), Array.from(this.setOfCheckedId), true)
        .subscribe(
          (r) => {
            this.linking = false;
            this.isConfirmLoading = false;
            this.loading = false;

            this.setOfCheckedId.clear();
            this.refreshCheckedStatus();
            this.message.success('Estudiantes vinculados con éxito');

            this.getStudents();
          },
          (error) => {
            this.linking = false;
            this.isConfirmLoading = false;
            this.loading = false;

            const statusCode = error.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al vincular a los estudiantes.', error.message, {
                nzDuration: 0
              });
            }
          }
        );
    }
  }
  //#endregion

  //#region Custom modals
  showModal(vinculate: boolean): void {
    if (vinculate) {
      this.filteredList = this.dataTables.availables.filter((x) =>
        Array.from(this.setOfCheckedId).includes(x.student.id)
      );

      this.linking = true;
    } else {
      this.filteredList = this.dataTables.students.filter((x) =>
        Array.from(this.setOfCheckedId).includes(x.student.id)
      );

      this.unlinking = true;
    }
  }

  handleOk(vinculate: boolean): void {
    if (vinculate) this.linkStudents();
  }

  handleCancel(vinculate: boolean): void {
    vinculate ? (this.linking = false) : (this.unlinking = false);
  }
  //#endregion
}
