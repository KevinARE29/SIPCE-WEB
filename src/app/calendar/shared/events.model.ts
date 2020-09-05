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
  Users: Array<number>;
  Students: Array<number>;
}
