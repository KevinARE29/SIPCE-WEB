import { Cycle } from './../../shared/cycle.model';
import { Grade } from './../../shared/grade.model';
import { Section } from './../../shared/section.model';
import { Role } from './../../roles/shared/role.model';

export class User {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  roles: Role[];
  cycle: Cycle;
  grades: Grade[];
  section: Section;
  active: boolean;
}
