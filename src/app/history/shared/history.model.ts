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
}
