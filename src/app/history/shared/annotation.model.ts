import { User } from 'src/app/users/shared/user.model';

export class Annotation {
  id: number;
  title: string;
  description: string;
  annotationDate: Date;
  reporter: User;
  createdAt: Date;

  // Frontend field.
  editable: boolean;

  // Search params.
  startedAt: Date;
  finishedAt: Date;

  // Reports
  annotationDateString: string;
}
