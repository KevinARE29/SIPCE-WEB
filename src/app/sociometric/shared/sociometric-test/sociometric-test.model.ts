import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Student } from 'src/app/students/shared/student.model';
import { QuestionBank } from '../question-bank.model';

export class SociometricTest {
  id: number;
  shift: ShiftPeriodGrade;
  grade: ShiftPeriodGrade;
  section: ShiftPeriodGrade;
  answersPerQuestion: number;
  status: string;
  completed: boolean;
  completedEstudents: number;
  totalEstudents: number;
  questionBank: QuestionBank;
  students: Student[];
  createdAt: Date;
}
