import { ShiftPeriodGrade } from './../../manage-academic-catalogs/shared/shiftPeriodGrade.model';

export class Student {
  code: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  currentGrade: ShiftPeriodGrade;
}
