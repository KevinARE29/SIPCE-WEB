import { Student } from 'src/app/students/shared/student.model';

export class StudentWithCounters extends Student {
  annotationsCounter: number;
  sanctionsCounter: number;
}
