import { Student } from 'src/app/students/shared/student.model';

export class StudentWithHistory extends Student {
  annotationsCounter: number;
  sanctionsCounter: number;
}
