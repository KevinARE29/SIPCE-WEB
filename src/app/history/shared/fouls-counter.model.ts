export class FoulsCounter {
  period: string;
  displayAlert: boolean;
  foulsCounter: {
    minorFouls: number;
    minorFoulsAlert: boolean;
    seriousFouls: number;
    seriousFoulsAlert: boolean;
    verySeriousFouls: number;
    verySeriousFoulsAlert: boolean;
    totalSanctions: number;
  };
}
