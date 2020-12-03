import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Catalogs } from '../../shared/catalogs.model';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { User } from 'src/app/users/shared/user.model';
import { UserService } from 'src/app/users/shared/user.service';

interface ItemData {
  section: ShiftPeriodGrade;
  auxTeachers: User[];
}

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  loading = false;
  listOfTeachers: User[];
  headTeachers: string[] = [];
  items: unknown[] = [];

  @Output() teachersEvent = new EventEmitter<unknown>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTeachers();
  }

  getTeachers(): void {
    this.loading = true;
    this.userService.getUsersByRole(7).subscribe((data) => {
      this.listOfTeachers = data['data'];
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
            const auxTeachers = section['auxTeachers'] ? section['auxTeachers'] : null;

            if (auxTeachers) {
              auxTeachers.forEach((t) => {
                t.fullname = t.firstname.concat(' ', t.lastname);
              });
            }

            sections.push({
              section: { ...section['section'] },
              auxTeachers: auxTeachers
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
        teachers: this.listOfTeachers.map((teacher) => {
          return { ...teacher };
        })
      };

      item['filteredOptions'] = [...item.teachers];

      this.items.push(item);
    });
  }

  onChange(item: unknown, grade: ShiftPeriodGrade, section: ShiftPeriodGrade, aux_teachers: User[]): void {
    this.teachersEvent.emit({ shift: item['shift'], grade, section, aux_teachers });
  }

  compareFn = (o1: User, o2: User) => {
    if (o1 && o2) {
      return o1.id === o2.id;
    } else {
      return false;
    }
  };
}
