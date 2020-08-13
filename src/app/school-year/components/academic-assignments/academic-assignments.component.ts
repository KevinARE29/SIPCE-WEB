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
  preConfig: ItemData[] = [];

  @Output() cycleEvent = new EventEmitter<string>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown[];
  @Input() isActive: boolean;

  allCatalogs: Catalogs;
  sections: ShiftPeriodGrade[];
  content: string;

  constructor() {}

  ngOnInit(): void {
    this.sections = new Array<ShiftPeriodGrade>();

    this.catalogs.sections.forEach((section) => {
      this.sections.push({ id: section.id, name: section.name, active: false });
    });

    this.isActive ? this.currentData() : this.generateDataTable();
  }

  // Transform the data
  generateDataTable(): void {
    const emptySections = new Array<ShiftPeriodGrade>();

    this.sections.forEach((section) => {
      section.active = true;
      emptySections.push({ id: section.id, name: section.name, active: false });
    });

    //#region Get current assaignation
    if (this.assignation[0]) {
      // Cycles
      Object.entries(this.assignation[0]['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];
        // Grades
        Object.entries(value['gradeDetails']).forEach(([key, value]) => {
          const sections = new Array<ShiftPeriodGrade>();
          // Sections
          Object.entries(value['sectionDetails']).forEach(([key, value]) => {
            sections.push(value['section']);
          });

          this.preConfig.push({ cycle: cycle, grade: value['grade'], sections: sections });
        });
      });
    }
    //#endregion

    //#region Merge data
    this.catalogs.grades.forEach((grade) => {
      const dataRow = this.preConfig.find((x) => x['grade'].id === grade.id);

      if (dataRow) {
        const sections = new Array<ShiftPeriodGrade>();

        this.sections.forEach((section) => {
          const findSection = dataRow['sections'].find((x) => x['id'] === section.id);
          findSection
            ? sections.push({
                id: findSection['id'],
                name: findSection['name'],
                active: true
              })
            : sections.push({ id: section.id, name: section.name, active: false });
        });

        this.listOfData.push({ cycle: dataRow['cycle'], grade: grade, sections: sections });
      } else {
        this.listOfData.push({ cycle: new ShiftPeriodGrade(), grade: grade, sections: emptySections });
      }
    });
    //#endregion
  }

  currentData(): void {
    const emptySections = new Array<ShiftPeriodGrade>();

    this.sections.forEach((section) => {
      emptySections.push({ id: section.id, name: section.name, active: false });
    });

    //#region Get current assaignation
    if (this.assignation[0]) {
      // Cycles
      Object.entries(this.assignation[0]['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];
        // Grades
        Object.entries(value['gradeDetails']).forEach(([key, value]) => {
          const sections = new Array<ShiftPeriodGrade>();
          // Sections
          Object.entries(value['sectionDetails']).forEach(([key, value]) => {
            sections.push(value['section']);
          });

          this.preConfig.push({ cycle: cycle, grade: value['grade'], sections: sections });
        });
      });
    }
    //#endregion

    //#region Merge data
    this.catalogs.grades.forEach((grade) => {
      const dataRow = this.preConfig.find((x) => x['grade'].id === grade.id);

      if (dataRow) {
        const sections = new Array<ShiftPeriodGrade>();

        this.sections.forEach((section) => {
          const findSection = dataRow['sections'].find((x) => x['id'] === section.id);

          if (findSection) {
            if (!section.active || section.active === undefined) section.active = true;
            sections.push({
              id: findSection['id'],
              name: findSection['name'],
              active: true
            });
          }
        });

        this.listOfData.push({ cycle: dataRow['cycle'], grade: grade, sections: sections });
      }
    });
    //#endregion
    this.fillBlanks();
  }

  fillBlanks(): void {
    this.sections
      .filter((x) => x.active === true)
      .forEach((section) => {
        this.listOfData.forEach((data) => {
          const findSection = data['sections'].find((x) => x.id === section.id);

          if (!findSection) {
            data['sections'].push({ id: section.id, name: section.name, active: false });
          }
        });
      });

    this.listOfData.forEach((data) => {
      data['sections'] = data['sections'].sort((a, b) => a.id - b.id);
      data['sections'] = data['sections']
        .filter((x) => x.name.length === 1)
        .concat(data['sections'].filter((x) => x.name.length > 1));
    });
  }

  updateField(value: string) {
    console.log(value);
    this.cycleEvent.emit(value);
  }
}
