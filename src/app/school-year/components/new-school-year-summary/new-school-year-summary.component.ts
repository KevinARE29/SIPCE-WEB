import { Component, OnInit, Input } from '@angular/core';

import { User } from 'src/app/users/shared/user.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

@Component({
  selector: 'app-new-school-year-summary',
  templateUrl: './new-school-year-summary.component.html',
  styleUrls: ['./new-school-year-summary.component.css']
})
export class NewSchoolYearSummaryComponent implements OnInit {
  @Input() assignation: unknown;
  shiftCounselors: unknown[] = [];

  constructor() {}

  ngOnInit(): void {
    this.orderAssignations();
  }

  orderAssignations(): void {
    this.assignation['shifts'].forEach((shift) => {
      const counselors = new Array<User>();
      shift['shift']['cycles'] = shift['shift']['cycles'].sort((a, b) => a['cycle']['id'] - b['cycle']['id']);

      shift['shift']['cycles'].forEach((cycle) => {
        cycle['gradeDetails'] = cycle['gradeDetails'].sort((a, b) => a['grade']['id'] - b['grade']['id']);

        cycle['gradeDetails'].forEach((grade) => {
          // Counselors
          let counselor = counselors.find((x) => x['id'] === grade['counselor']['id']);

          if (counselor) {
            counselor.grades.push(grade.grade);
          } else {
            counselor = grade['counselor'];
            counselor.grades = new Array<ShiftPeriodGrade>();
            counselor.grades.push(grade.grade);

            counselors.push(counselor);
          }

          // Sections
          grade['sectionDetails'].sort((a, b) => a['section'].id - b['section'].id);
          grade['sectionDetails'] = grade['sectionDetails']
            .filter((x) => x.section.name.length === 1)
            .concat(grade['sectionDetails'].filter((x) => x.section.name.length > 1));
        });
      });

      counselors.forEach((counselor) => {
        counselor['grades'] = counselor['grades'].sort((a, b) => a.id - b.id);
      });

      this.shiftCounselors.push({ shift: shift['shift'], counselors });
    });
  }
}
