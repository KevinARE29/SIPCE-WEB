import { Student } from 'src/app/students/shared/student.model';

export class Answer {
  myAnswers: {
    answersP: Student[];
    answersN: Student[];
  };
  studentsAnswers: {
    answersP: Student[];
    answersN: Student[];
  };
}
