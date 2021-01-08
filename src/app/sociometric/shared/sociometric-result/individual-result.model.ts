import { Answer } from './answer.model';
import { StudentWithSociometricIndexes } from './student-with-sociometric-indexes.model';

export class IndividualResult {
  individualIndex: StudentWithSociometricIndexes;
  answer: Answer;
}
