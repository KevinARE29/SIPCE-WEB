import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Student } from '../../shared/student.model';
import { StudentService } from '../../shared/student.service';
import { UserService } from 'src/app/users/shared/user.service';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

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
  sections: ShiftPeriodGrade[] = [];
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
  stChecked = false;
  indeterminate = false;
  stIndeterminate = false;
  setOfCheckedId = new Set<number>();
  setOfStudentsCheckedId = new Set<number>();
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
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.currentTab = 'availables';

    this.searchParams = new Student();
    this.searchParams.section = new ShiftPeriodGrade();
    this.searchParams.code = null;
    this.searchParams.firstname = null;
    this.searchParams.lastname = null;
    this.searchParams.id = null;

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
        switch (this.currentTab) {
          case 'availables':
            this.studentsWithoutAssignation = data['studentsWithoutAssignation'];
            break;
          case 'assigned':
            this.assignedStudents = data['assignedStudents'];
            break;
          case 'my students':
            this.myStudents = data['myStudents'];
            break;
        }

        this.sections = data['availableSections'];

        // Contains the copy of the original lists
        this.dataTables = {
          availables: data['studentsWithoutAssignation'],
          assigned: data['assignedStudents'],
          students: data['myStudents']
        };

        this.loading = false;
      });
    } else {
      this.dataTables = null;
      this.studentsWithoutAssignation = [];
      this.assignedStudents = [];
      this.myStudents = [];
      this.sections = [];
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

    this.assignedColumns = [
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
      },
      {
        title: 'Sección',
        compare: (a: Data, b: Data) => a.student.section.name.localeCompare(b.student.section.name),
        priority: 4
      }
    ];
  }

  cleanTab(tab: string): void {
    this.checked = false;
    this.stChecked = false;
    this.indeterminate = false;
    this.stIndeterminate = false;
    this.setOfCheckedId = new Set<number>();
    this.setOfStudentsCheckedId = new Set<number>();
    this.listOfCurrentPageData = new Array<Data>();
    this.filteredList = new Array<Data>();

    Object.keys(this.searchParams).forEach((key) => {
      this.searchParams[key] = null;
    });

    this.searchParams.section = new ShiftPeriodGrade();
    this.searchParams.section.id = null;

    if (this.currentTab !== tab) this.currentTab = tab;
    this.search(tab);
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

          this.setOfCheckedId = new Set<number>();
          break;

        case 'assigned':
          this.assignedStudents = this.dataTables.assigned.filter(
            (x) =>
              (!params.code || x['student'].code.toLowerCase().includes(params.code.toLowerCase())) &&
              (!params.firstname || x['student'].firstname.toLowerCase().includes(params.firstname.toLowerCase())) &&
              (!params.lastname || x['student'].lastname.toLowerCase().includes(params.lastname.toLowerCase())) &&
              (!params.section.id || x['student'].section.id === params.section.id)
          );
          break;

        case 'my students':
          this.myStudents = this.dataTables.students.filter(
            (x) =>
              (!params.code || x['student'].code.toLowerCase().includes(params.code.toLowerCase())) &&
              (!params.firstname || x['student'].firstname.toLowerCase().includes(params.firstname.toLowerCase())) &&
              (!params.lastname || x['student'].lastname.toLowerCase().includes(params.lastname.toLowerCase()))
          );

          this.setOfStudentsCheckedId = new Set<number>();
          break;
      }
    }
  }

  //#region Selection & operations over table
  updateCheckedSet(id: number, checked: boolean, vinculate: boolean): void {
    if (vinculate) {
      checked ? this.setOfCheckedId.add(id) : this.setOfCheckedId.delete(id);
    } else {
      checked ? this.setOfStudentsCheckedId.add(id) : this.setOfStudentsCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[], vinculate: boolean): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus(vinculate);
  }

  refreshCheckedStatus(vinculate: boolean): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);

    if (vinculate) {
      this.checked = listOfEnabledData.every(({ student }) => this.setOfCheckedId.has(student.id));
      this.indeterminate =
        listOfEnabledData.some(({ student }) => this.setOfCheckedId.has(student.id)) && !this.checked;
    } else {
      this.stChecked = listOfEnabledData.every(({ student }) => this.setOfStudentsCheckedId.has(student.id));
      this.stIndeterminate =
        listOfEnabledData.some(({ student }) => this.setOfStudentsCheckedId.has(student.id)) && !this.stChecked;
    }
  }

  onItemChecked(id: number, checked: boolean, vinculate: boolean): void {
    this.updateCheckedSet(id, checked, vinculate);
    this.refreshCheckedStatus(vinculate);
  }

  onAllChecked(checked: boolean, vinculate: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ student }) => this.updateCheckedSet(student.id, checked, vinculate));

    this.refreshCheckedStatus(vinculate);
  }

  linkStudents(vinculate: boolean): void {
    if (this.currentGrade) {
      const ids = this.currentGrade.split(';');
      const students = vinculate ? Array.from(this.setOfCheckedId) : Array.from(this.setOfStudentsCheckedId);

      this.loading = true;
      this.isConfirmLoading = true;

      this.studentService.updateStudentsAssignation(parseInt(ids[0]), parseInt(ids[1]), students, vinculate).subscribe(
        () => {
          this.linking = false;
          this.unlinking = false;
          this.isConfirmLoading = false;
          this.loading = false;

          this.setOfCheckedId.clear();
          this.refreshCheckedStatus(true);
          vinculate
            ? this.message.success('Estudiantes vinculados con éxito')
            : this.message.success('Estudiantes desvinculados con éxito');

          this.getStudents();
        },
        (error) => {
          const statusCode = error.statusCode;
          const notIn = [401, 403];

          this.isConfirmLoading = false;
          this.linking = false;
          this.unlinking = false;
          this.loading = false;

          this.setOfCheckedId.clear();

          if (!notIn.includes(statusCode) && statusCode < 500) {
            vinculate
              ? this.notification.create('error', 'Ocurrió un error al vincular a los estudiantes.', error.message, {
                  nzDuration: 0
                })
              : this.notification.create('error', 'Ocurrió un error al desvincular a los estudiantes.', error.message, {
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
        Array.from(this.setOfStudentsCheckedId).includes(x.student.id)
      );

      this.unlinking = true;
    }
  }

  handleOk(vinculate: boolean): void {
    this.linkStudents(vinculate);
  }

  handleCancel(vinculate: boolean): void {
    vinculate ? (this.linking = false) : (this.unlinking = false);
  }
  //#endregion
}
