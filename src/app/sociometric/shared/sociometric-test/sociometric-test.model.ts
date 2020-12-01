import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { QuestionBank } from '../question-bank.model';

export class SociometricTest {
  id: number;
  shift: ShiftPeriodGrade;
  grade: ShiftPeriodGrade;
  section: ShiftPeriodGrade;
  answersPerQuestion: number;
  status: string;
  completedEstudents: number;
  totalEstudents: number;
  questionBank: QuestionBank;
}
