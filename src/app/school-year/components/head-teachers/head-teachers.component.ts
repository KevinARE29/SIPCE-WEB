import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Catalogs } from '../../shared/catalogs.model';
import { UserService } from 'src/app/users/shared/user.service';
import { User } from 'src/app/users/shared/user.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

interface ItemData {
  section: ShiftPeriodGrade;
  teacher: User;
  error: string;
  initialDisabled: boolean;
}

@Component({
  selector: 'app-head-teachers',
  templateUrl: './head-teachers.component.html',
  styleUrls: ['./head-teachers.component.css']
})
export class HeadTeachersComponent implements OnInit {
  loading = false;
  teachers: User[];
  headTeachers: string[] = [];
  items: unknown[] = [];

  @Output() headTeachersEvent = new EventEmitter<unknown>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown;
  @Input() isValid: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getHeadTeachers();
  }

  getHeadTeachers(): void {
    this.loading = true;
    this.userService.getUsersByRole(3).subscribe((data) => {
      this.teachers = data['data'];
      this.loading = false;

      this.transformData();
    });
  }

  transformData(): void {
    this.catalogs.shifts.forEach((shift) => {
      const currentShift = this.assignation['shifts'].find((x) => x['shift']['id'] === shift.id);
      const listOfGrades = new Array<unknown>();

      Object.entries(currentShift['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];

        value['gradeDetails'].forEach((grade) => {
          let sections = new Array<ItemData>();

          grade['sectionDetails'].forEach((section) => {
            const teacher = section['teacher'];

            sections.push({
              section: { ...section['section'] },
              teacher: teacher ? { ...teacher } : '',
              error: null,
              initialDisabled: false
            });
          });

          sections.sort((a, b) => a['section'].id - b['section'].id);
          sections = sections
            .filter((x) => x.section.name.length === 1)
            .concat(sections.filter((x) => x.section.name.length > 1));

          listOfGrades.push({ cycle: { ...cycle }, grade: { ...grade['grade'] }, sections: sections });
        });
      });

      listOfGrades.sort((a, b) => a['grade'].id - b['grade'].id);

      const item = {
        shift,
        grades: listOfGrades,
        teachers: this.teachers.map((teacher) => {
          return { ...teacher };
        })
      };

      item['filteredOptions'] = [...item.teachers];

      const idTeachers = item.teachers.map((teacher) => teacher.id);

      listOfGrades.forEach((grade) => {
        grade['sections'].forEach((section) => {
          if (section.teacher.id) {
            if (idTeachers.includes(section.teacher.id)) {
              section.teacher = item.teachers.find((teacher) => teacher.id === section.teacher.id);
              // Make it not show up in the possible options
              section.teacher.active = false;
            } else {
              // If the teacher is not there, add him/her to the initial list only, and add an error to the section.
              item['filteredOptions'].push(section.teacher);

              section.error = 'El docente asignado no está entre los docentes titulares registrados';
              if (!section.teacher.fullname) {
                section.teacher.fullname = section.teacher.firstname.concat(' ', section.teacher.lastname);
              }
              this.headTeachersEvent.emit({ shift: item['shift'], grade: grade, section: section });
            }
            section.initialDisabled = true;
          } else {
            section.teacher = null;
          }
        });
      });

      this.items.push(item);
    });
  }

  onBlur(section: unknown, grade: unknown, item: unknown): void {
    if (typeof section['teacher'] === 'string') {
      if (section['teacher'].length > 0) section['error'] = 'No se encontró un docente titular con ese nombre';
    } else if (typeof section['teacher'] === 'object') {
      section['teacher'].active = false;
      document
        .getElementById(item['shift']['id'] + '_' + grade['grade']['id'] + '_' + section['section']['id'])
        .setAttribute('disabled', 'true');

      this.headTeachersEvent.emit({ shift: item['shift'], grade: grade, section: section });
    }

    item['filteredOptions'] = item['teachers'];
  }

  onChange(value: string, item: unknown): void {
    if (typeof value === 'string') {
      item['filteredOptions'] = item['teachers'].filter((teacher) => {
        return teacher['fullname'].toLowerCase().includes(value.toLowerCase());
      });
    }
  }

  cleanTeacher(section: unknown, grade: unknown, item: unknown): void {
    if (typeof section['teacher'] === 'object') {
      section['teacher'].active = true;
      section['teacher'] = '';
      section['error'] = null;
      this.headTeachersEvent.emit({ shift: item['shift'], grade: grade, section: section });

      document
        .getElementById(item['shift']['id'] + '_' + grade['grade']['id'] + '_' + section['section']['id'])
        .removeAttribute('disabled');
    } else if (typeof section['teacher'] === 'string') {
      section['teacher'] = '';
      section['error'] = null;
    }
  }

  compareFun = (o1: User | string, o2: User) => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.fullname : o1.id === o2.id;
    } else {
      return false;
    }
  };
}
