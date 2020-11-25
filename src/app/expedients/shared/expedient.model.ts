import { InterventionProgram } from './intervention-program.model';
import { Evaluation } from './session.model';

export class SessionsCounter {
  individualSessionCounter: number;
  parentsInterviewCounter: number;
  teachersInterviewCounter: number;
}

export class Expedient {
  id: number;

  expedientGrade: string;
  referrerName: string;
  reason: string;

  problemDescription: string;
  diagnosticImpression: string;
  diagnosticImpressionCategories: string[];
  externalPsychologicalTreatments: string[];
  actionPlan: string;
  finalConclusion: string;

  activeInterventionPrograms: InterventionProgram[];
  evaluations: Evaluation[];

  sessionsCounter: SessionsCounter;
}
