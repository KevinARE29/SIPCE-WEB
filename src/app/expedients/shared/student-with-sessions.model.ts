import { Student } from 'src/app/students/shared/student.model';
import { Expedient } from './expedient.model';

export class StudentWithSessions extends Student {
  expedient: Expedient;
  sessionsCounter: number;
}
