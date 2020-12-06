import { Student } from 'src/app/students/shared/student.model';
import { Expedient } from './expedient.model';

export class StudentWithExpedient {
  student: Student;
  expedient: Expedient;
  date: string;
}
