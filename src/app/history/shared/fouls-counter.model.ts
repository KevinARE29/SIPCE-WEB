import { FoulAssignation } from './foul-assignation.model';

export class FoulsCounter {
  period: string;
  foulsCounter: {
    minorFouls: number;
    seriousFouls: number;
    verySeriousFouls: number;
    totalSanctions: number;

    // Frontend fields.
    minorFoulsAlert: boolean;
    seriousFoulsAlert: boolean;
    verySeriousFoulsAlert: boolean;
  };

  // Frontend field.
  displayAlert: boolean;

  // Report field.
  fouls: FoulAssignation[];
}
