import { Student } from 'src/app/students/shared/student.model';
import { User } from 'src/app/users/shared/user.model';

export class Appointment {
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
  Participants: User[];
  Student: Student;
}
