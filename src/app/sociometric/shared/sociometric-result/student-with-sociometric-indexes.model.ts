import { Student } from 'src/app/students/shared/student.model';
import { IndividualIndexes } from './individual-indexes.model';
import { SociometricValues } from './sociometric-values.model';

export class StudentWithSociometricIndexes extends IndividualIndexes {
  student: Student;
  sociometricValues: SociometricValues;
}
