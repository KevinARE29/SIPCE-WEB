import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

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
  lists: unknown[] = [];
  // listOfData: ItemData[];
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

  // ngOnChanges(changes: SimpleChanges): void {
  //   for (const propName in changes) {
  //     const chng = changes[propName];
  //     const cur = chng.currentValue;
  //     const prev = chng.previousValue;

  //     console.log(`${propName}`, cur === prev, cur, prev);
  //   }
  // }

  //#region Transform the data
  generateDataTable(): void {
    const emptySections = new Array<ShiftPeriodGrade>();

    this.sections.forEach((section) => {
      section.active = true;
      emptySections.push({ id: section.id, name: section.name, active: false });
    });

    this.catalogs.shifts.forEach((shift) => {
      const currentShift = this.getShifts(shift.id);
      const listOfData = new Array<ItemData>();

      // Get current assignation
      Object.entries(currentShift[0]['shift']['cycles']).forEach(([key, value]) => {
        const cycle = value['cycle'];

        Object.entries(value['gradeDetails']).forEach(([key, value]) => {
          const sections = new Array<ShiftPeriodGrade>();

          Object.entries(value['sectionDetails']).forEach(([key, value]) => {
            sections.push(value['section']);
          });

          this.preConfig.push({ cycle: { ...cycle }, grade: value['grade'], sections: sections });
        });
      });

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

          listOfData.push({ cycle: dataRow['cycle'], grade: grade, sections: sections });
        } else {
          const newSections = new Array<ShiftPeriodGrade>();
          this.sections.forEach((section) => {
            newSections.push({ id: section.id, name: section.name, active: false });
          });
          listOfData.push({ cycle: new ShiftPeriodGrade(), grade: grade, sections: newSections });
        }
      });

      this.lists.push({ shift, items: listOfData });
    });
  }

  updateField(field: any, type: string, data: unknown, shift: ShiftPeriodGrade): void {
    this.academicEvent.emit({ shift: shift, field, type, data });
  }
  //#endregion

  //#region Get assignation
  currentData(): void {
    const emptySections = new Array<ShiftPeriodGrade>();
    let listOfData = new Array<ItemData>();

    this.sections.forEach((section) => {
      emptySections.push({ id: section.id, name: section.name, active: false });
    });

    this.catalogs.shifts.forEach((shift) => {
      // Get current assignation
      const currentShift = this.assignation[0]['shifts'].filter((x) => x['shift']['id'] === shift.id);

      if (currentShift.length) {
        Object.entries(currentShift[0]['shift']['cycles']).forEach(([key, value]) => {
          const cycle = value['cycle'];

          Object.entries(value['gradeDetails']).forEach(([key, value]) => {
            const sections = new Array<ShiftPeriodGrade>();

            Object.entries(value['sectionDetails']).forEach(([key, value]) => {
              sections.push(value['section']);
            });

            this.preConfig.push({ cycle: cycle, grade: value['grade'], sections: sections });
          });
        });

        // Merge data
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

            listOfData.push({ cycle: dataRow['cycle'], grade: grade, sections: sections });
          }
        });
      }
      listOfData = this.fillBlanks(listOfData);
      this.lists.push({ shift, items: listOfData });
    });
  }

  fillBlanks(listOfData: ItemData[]): ItemData[] {
    this.sections
      .filter((x) => x.active === true)
      .forEach((section) => {
        listOfData.forEach((data) => {
          const findSection = data['sections'].find((x) => x.id === section.id);
          if (!findSection) {
            data['sections'].push({ id: section.id, name: section.name, active: false });
          }
        });
      });

    listOfData.forEach((data) => {
      data['sections'] = data['sections'].sort((a, b) => a.id - b.id);
      data['sections'] = data['sections']
        .filter((x) => x.name.length === 1)
        .concat(data['sections'].filter((x) => x.name.length > 1));
    });

    return listOfData;
  }
  //#endregion

  getShifts(id: number): unknown {
    let currentShift: unknown;
    let previousShift: unknown;

    currentShift = this.assignation[0]['shifts'].filter((x) => x['shift']['id'] === id);

    previousShift = this.assignation[1]['shifts'].filter((x) => x['shift']['id'] === id);

    if (Object.keys(currentShift).length === 0 && Object.keys(previousShift).length === 0) {
      currentShift = [
        {
          shift: {
            id: id,
            cycles: {}
          }
        }
      ];
    } else if (Object.keys(currentShift).length === 0 && Object.keys(previousShift).length >= 0) {
      currentShift = previousShift;
    }

    return currentShift;
  }
}
