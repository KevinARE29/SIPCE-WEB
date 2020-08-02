import { ShiftPeriodGrade } from './../../manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Responsible } from './responsible.model';

export class Student {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;
  status: string;
  shift: ShiftPeriodGrade;
  grade: ShiftPeriodGrade;
  startedGrade: ShiftPeriodGrade;
  registrationYear: number;
  responsibles: Responsible[];
  images: unknown[];
}
