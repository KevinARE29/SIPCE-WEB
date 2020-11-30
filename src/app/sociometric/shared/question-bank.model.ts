import { Question } from './question.model';

export class QuestionBank {
  id: number;
  name: string;
  editable: boolean;
  questions: Question[];
}
