import { User } from 'src/app/users/shared/user.model';
import { InterventionProgram } from './intervention-program.model';
import { Evaluation, Session } from './session.model';

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
  otherDiagnosticImpressionCategory: string;
  externalPsychologicalTreatments: string[];
  otherExternalPsychologicalTreatment: string;

  actionPlan: string;
  finalConclusion: string;

  activeInterventionPrograms: InterventionProgram[];
  evaluations: Evaluation[];

  sessionsCounter: SessionsCounter;

  // Report fields
  sessions: Session[];
  expedientCounselor: User;
  createdAtString: string;
  expedientYear: string;
}
