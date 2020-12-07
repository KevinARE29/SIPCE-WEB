import { Foul } from 'src/app/disciplinary-catalogs/shared/foul.model';
import { Sanction } from 'src/app/disciplinary-catalogs/shared/sanction.model';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';

export class FoulAssignation {
  id: number;
  issueDate: Date;
  createdAt: Date;
  foul: Foul;
  sanction: Sanction;
  period: ShiftPeriodGrade;

  // Control param.
  editable: boolean;

  // Filters.
  createdStart: Date;
  createdEnd: Date;
  issueDateStart: Date;
  issueDateEnd: Date;

  // Reports
  issueDateString: string;
}
