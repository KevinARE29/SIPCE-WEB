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

  @Output() academicEvent = new EventEmitter<unknown>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown[];
  @Input() isActive: boolean;

  allCatalogs: Catalogs;
  sections: ShiftPeriodGrade[];

  constructor() {}

  ngOnInit(): void {
    this.sections = new Array<ShiftPeriodGrade>();

    this.catalogs.sections.forEach((section) => {
      this.sections.push({ id: section.id, name: section.name, active: false });
    });

    this.isActive ? this.currentData() : this.generateDataTable();
  }

  //#region Transform the data
  generateDataTable(): void {
    const emptySections = new Array<ShiftPeriodGrade>();

    this.sections.forEach((section) => {
      section.active = true;
      emptySections.push({ id: section.id, name: section.name, active: false });
    });
    console.log(this.assignation);
    // Get current assignation
    if (this.assignation[0] && this.assignation[0][0]) {
      // Cycles
      Object.entries(this.assignation[0][0]['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];
        // Grades
        Object.entries(value['gradeDetails']).forEach(([key, value]) => {
          const sections = new Array<ShiftPeriodGrade>();
          // Sections
          Object.entries(value['sectionDetails']).forEach(([key, value]) => {
            sections.push(value['section']);
          });

          this.preConfig.push({ cycle: { ...cycle }, grade: value['grade'], sections: sections });
        });
      });
    } else if (this.assignation[1] && this.assignation[1][0]) {
      // Cycles
      Object.entries(this.assignation[1][0]['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];
        // Grades
        Object.entries(value['gradeDetails']).forEach(([key, value]) => {
          const sections = new Array<ShiftPeriodGrade>();
          // Sections
          Object.entries(value['sectionDetails']).forEach(([key, value]) => {
            sections.push(value['section']);
          });

          this.preConfig.push({ cycle: { ...cycle }, grade: value['grade'], sections: sections });
        });
      });
    }

    // Merge data
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
  }

  updateField(field: ShiftPeriodGrade, type: string, data: unknown): void {
    this.academicEvent.emit({ field, type, data });
  }
  //#endregion

  //#region Get assignation
  currentData(): void {
    const emptySections = new Array<ShiftPeriodGrade>();

    this.sections.forEach((section) => {
      emptySections.push({ id: section.id, name: section.name, active: false });
    });

    //#region Get current assaignation
    if (this.assignation[0][0]) {
      // Cycles
      Object.entries(this.assignation[0][0]['shift']['cycles']).forEach(([key, value]) => {
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
  //#endregion
}
