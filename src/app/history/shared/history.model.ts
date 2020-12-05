import { Annotation } from './annotation.model';
import { FoulsCounter } from './fouls-counter.model';

export class ExpedientHistory {
  finalConclusion: string;
  author: string;
  grade: string;
}

export class History {
  id: number;
  finalConclusion: string;
  author: string;
  authorId: number;
  behavioralHistoryGrade: string;
  behavioralHistoryYear: number;
  foulsCounter: number;
  expedients: ExpedientHistory[];

  // For reports.
  annotations: Annotation[];
  behavioralHistoryfouls: FoulsCounter[];
}
