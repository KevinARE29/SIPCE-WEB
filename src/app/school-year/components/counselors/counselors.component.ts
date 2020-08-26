import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Catalogs } from '../../shared/catalogs.model';
import { UserService } from 'src/app/users/shared/user.service';
import { User } from 'src/app/users/shared/user.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-counselors',
  templateUrl: './counselors.component.html',
  styleUrls: ['./counselors.component.css']
})
export class CounselorsComponent implements OnInit {
  loading = false;
  counselors: User[];
  items: unknown[] = [];

  @Output() counselorsEvent = new EventEmitter<unknown>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown;
  @Input() isValid: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getCounselors();
  }

  getCounselors(): void {
    this.loading = true;
    this.userService.getUsersByRole(1).subscribe((data) => {
      this.counselors = data['data'];
      this.loading = false;

      this.transformData();
    });
  }

  transformData(): void {
    this.catalogs.shifts.forEach((shift) => {
      const currentShift = this.assignation['shifts'].find((x) => x['shift']['id'] === shift.id);
      const listOfGrades = new Array<ShiftPeriodGrade>();

      this.counselors.forEach((counselor) => {
        counselor.grades = new Array<ShiftPeriodGrade>();
        counselor['gradesCache'] = new Array<ShiftPeriodGrade>();
      });

      Object.entries(currentShift['shift']['cycles']).forEach(([key, value]) => {
        value['gradeDetails'].forEach((grade) => {
          const counselor = grade.counselor ? this.counselors.find((x) => x.id === grade.counselor.id) : null;
          const addGrade = grade.grade;

          if (counselor) {
            counselor.grades.push(addGrade);
            counselor['gradesCache'].push(addGrade);
            addGrade.active = false;
          } else {
            addGrade.active = true;
          }

          listOfGrades.push(grade.grade);
        });
      });
      listOfGrades.sort((a, b) => a.id - b.id);

      const item = {
        shift,
        counselors: this.counselors.map((counselor) => {
          return { ...counselor };
        }),
        grades: listOfGrades.map((grade) => {
          return { ...grade };
        })
      };
      this.items.push(item);
    });
  }

  onChange(item: unknown, counselor: User, gradesId: number[]): void {
    let remove;
    // Assign new grades
    gradesId.forEach((grade) => {
      const currentGrade = item['grades'].find((x) => x.id === grade);
      currentGrade.active = false;
    });

    if (counselor['gradesCache'].length > counselor.grades.length) {
      counselor['gradesCache'].forEach((g) => {
        const grade = counselor.grades.find((x) => x === g);

        if (!grade) {
          remove = item['grades'].find((x) => x.id == g);
          remove.active = true;
        }
      });
    }

    this.counselorsEvent.emit({ shift: item['shift'], counselor, remove });
    counselor['gradesCache'] = [...counselor.grades];
  }
}
