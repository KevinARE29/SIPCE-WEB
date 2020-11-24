import { Session } from './session.model';

export class Expedient {
  id: number;
  referrerName: string;
  referrerCharge: string;
  reason: string;
  problemDescription: string;
  diagnosticImpression: string;
  diagnosticImpressionCategories: string[];
  actionPlan: string;
  finalConclusion: string;
  sessions: Session[];
}
