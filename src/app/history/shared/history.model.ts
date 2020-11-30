export class ExpedientHistory {
  finalConclussion: string;
  author: string;
  grade: string;
}

export class History {
  id: number;
  finalConclusion: string;
  author: string;
  behavioralHistoryGrade: string;
  behavioralHistoryYear: number;
  foulsCounter: number;
  expedients: ExpedientHistory[];
}
