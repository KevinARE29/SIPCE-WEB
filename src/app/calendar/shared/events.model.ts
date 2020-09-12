import { Student } from 'src/app/students/shared/student.model';
import { User } from 'src/app/users/shared/user.model';

export class Events {
  Id: number;
  Subject: string;
  EventType: string;
  Location: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay: boolean;
  RecurrenceID: number;
  RecurrenceRule: string;
  RecurrenceException: string;
  Description: string;
  Users: User[];
  Students: Student;
}
