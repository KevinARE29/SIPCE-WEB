import { Student } from 'src/app/students/shared/student.model';

export class Question {
  id: number;
  sequentialNumber: number;
  connotation: boolean;
  text: string;
  students: Student[];
  status: string; // Completed, Current, Incomplete, Partial

  constructor(
    id: number,
    sequentialNumber: number,
    connotation: boolean,
    text: string,
    students: Student[],
    status: string
  ) {
    this.id = id;
    this.sequentialNumber = sequentialNumber;
    this.connotation = connotation;
    this.text = text;
    this.students = students;
    this.status = status;
  }
}
