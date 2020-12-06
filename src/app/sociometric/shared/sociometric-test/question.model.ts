import { Student } from 'src/app/students/shared/student.model';

export class Question {
  id: number;
  sequentialNumber: number;
  connotation: boolean;
  students: Student[];
  selectedStudents: Student[];
  status: string; // Completed, Current, Incomplete, Partial

  constructor(
    id: number,
    sequentialNumber: number,
    connotation: boolean,
    students: Student[],
    selectedStudents: Student[],
    status: string
  ) {
    this.id = id;
    this.sequentialNumber = sequentialNumber;
    this.connotation = connotation;
    this.students = students;
    this.selectedStudents = selectedStudents;
    this.status = status;
  }
}
