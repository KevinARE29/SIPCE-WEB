import { Student } from 'src/app/students/shared/student.model';
import { History } from './history.model';

export class StudentWithHistory {
  student: Student;
  behavioralHistory: History;
  date: string;
}
