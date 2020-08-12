import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Catalogs } from '../../shared/catalogs.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

interface ItemData {
  cycle: ShiftPeriodGrade;
  grade: ShiftPeriodGrade;
  sections: ShiftPeriodGrade[];
}
@Component({
  selector: 'app-academic-assignments',
  templateUrl: './academic-assignments.component.html',
  styleUrls: ['./academic-assignments.component.css']
})
export class AcademicAssignmentsComponent implements OnInit {
  listOfData: ItemData[] = [];

  @Output() cycleEvent = new EventEmitter<string>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown[];

  allCatalogs: Catalogs;
  content: string;

  constructor() {}

  ngOnInit(): void {
    this.generateDataTable();
  }

  // Transform the data
  generateDataTable(): void {
    this.catalogs.grades.forEach((grade) => {
      let row: ItemData;
      const emptySections = new Array<ShiftPeriodGrade>();

      this.catalogs.sections.forEach((section) => {
        emptySections.push({ id: section.id, name: section.name, active: false });
      });

      // Check if there's an available assignation
      if (this.assignation[0]) {
        Object.entries(this.assignation[0]['shift']['cycles']).forEach(([key, value]) => {
          const findGrade = value['gradeDetails'].find((x) => x.id === grade.id);
          if (findGrade) {
            const sections = new Array<ShiftPeriodGrade>();

            this.catalogs.sections.forEach((section) => {
              const findSection = findGrade['sectionDetails'].find((x) => x['section'].id === section.id);
              findSection
                ? sections.push({
                    id: findSection['section']['id'],
                    name: findSection['section']['name'],
                    active: true
                  })
                : sections.push({ id: section.id, name: section.name, active: false });
            });

            row = { cycle: value['cycle'], grade: grade, sections: sections };
          } else {
            row = { cycle: new ShiftPeriodGrade(), grade: grade, sections: emptySections };
          }
        });
      } else {
        // If no, add and empty row for the current grade
        row = { cycle: new ShiftPeriodGrade(), grade: grade, sections: emptySections };
      }
      this.listOfData.push(row);
    });
    console.log('------------------', this.listOfData, '------------------', this.assignation, '------------------');
  }

  updateField(value: string){
    console.log(value);
    this.cycleEvent.emit(value);
  }
}
