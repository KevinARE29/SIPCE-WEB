export class Preset {
  id: number;
  password: string;
  duration: number;
  startedAt: Date;
  endedAt: Date;
  isPassVisible: boolean;

  // Formated values
  durationInWords: string;
  startedAtInWords: string;
}
