import { Student } from 'src/app/students/shared/student.model';
import { User } from 'src/app/users/shared/user.model';
import { History } from './history.model';

export class StudentWithHistory {
  student: Student;
  behavioralHistory: History;
  date: string;
  user: User;
}
