import { Component, OnInit, Input } from '@angular/core';

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
      console.log(this.teachers);
      this.transformData();
    });
  }

  transformData(): void {
    console.log('TRANSFORM DATA');
    this.catalogs.shifts.forEach((shift) => {
      const currentShift = this.assignation['shifts'].find((x) => x['shift']['id'] === shift.id);
      const listOfGrades = new Array<unknown>();

      Object.entries(currentShift['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];

        value['gradeDetails'].forEach((grade) => {
          const sections = new Array<ItemData>();

          grade['sectionDetails'].forEach((section) => {
            const teacher = section['teacher'];

            sections.push({
              section: { ...section['section'] },
              teacher: teacher ? { ...teacher } : '',
              error: null,
              initialDisabled: false
            });
          });

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

      listOfGrades.forEach((data) => {
        data['sections'].forEach((section) => {
          if (section.teacher) {
            if (idTeachers.includes(section.teacher.id)) {
              section.teacher = item.teachers.find((teacher) => teacher.id === section.teacher.id);
              // Make it not show up in the possible options
              section.teacher.active = false;
            } else {
              // If the teacher is not there, add him/her to the initial list only, and add an error to the section.
              item['filteredOptions'].push(section.teacher);
              section.error = 'El docente asignado no está entre los docentes titulares registrados';
              // this.headTeachersEvent.emit({ shift: item['shift'], grade: data });
            }
            section.initialDisabled = true;
          }
        });
      });

      this.items.push(item);
    });
    console.log(this.items);
  }
}
