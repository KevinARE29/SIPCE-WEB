import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Student } from 'src/app/students/shared/student.model';
import { QuestionBank } from '../question-bank.model';
import { Question } from '../question.model';
import { GroupalIndexes } from './groupal-indexes.model';
import { IndividualIndexes } from './individual-indexes.model';
import { SociometricArrayValues } from './sociometric-array-values.model';
import { SociometricValues } from './sociometric-values.model';

export class IndividualReport {
  question: Question;
  indexes: IndividualIndexes;
  sociometricValues: SociometricValues;
}

export class StudentWithIndiviualReport extends Student {
  questions: IndividualReport[];
}

export class GeneralReport {
  sociomatrixData: {
    participants: Student[];
    sociomatrix: number[][];
    sociometricValues: SociometricArrayValues;
  };
  groupalIndexesData: GroupalIndexes;
}

export class SociometricResult {
  shift: ShiftPeriodGrade;
  grade: ShiftPeriodGrade;
  section: ShiftPeriodGrade;
  students: Student[];
  questionBank: QuestionBank;
  generalReports: GeneralReport[];
  individualReports: StudentWithIndiviualReport[];
  date: string;
}
