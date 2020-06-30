import { User } from './../../shared/user.model';

export class ActionLog {
  id: number;
  user: User;
  action: any;
  endpoint: string;
  statusCode: number;
  attemptTime: any;
}
