import { Student } from 'src/app/students/shared/student.model';
import { Question } from '../question.model';
import { Answer } from './answer.model';
import { GrupalIndexes } from './grupal-indexes.model';
import { SociometricArrayValues } from './sociometric-array-values.model';
import { StudentWithSociometricIndexes } from './student-with-sociometric-indexes.model';

export class GrupalResult {
  year: number;
  shift: string;
  grade: string;
  section: string;
  question: Question;
  participants: Student[];
  sociomatrix: number[][];
  sociometricValues: SociometricArrayValues;
  individualIndexes: StudentWithSociometricIndexes[];
  grupalIndexes: GrupalIndexes;
  answersPerStudent: Answer[];
}
