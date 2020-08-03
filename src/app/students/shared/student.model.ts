import { ShiftPeriodGrade } from './../../manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Responsible } from './responsible.model';

export class Student {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;
  age: number;
  status: string;
  shift: ShiftPeriodGrade;
  cycle: ShiftPeriodGrade;
  grade: ShiftPeriodGrade;
  section: ShiftPeriodGrade;
  startedGrade: ShiftPeriodGrade;
  registrationYear: number;
  sectionDetail: unknown;
  responsibles: Responsible[];
  images: unknown[];
  siblings: unknown;
}
