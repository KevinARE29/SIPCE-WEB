import { Cycle } from '../../shared/cycle.model';
import { ShiftPeriodGrade } from './../../manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { Section } from '../../shared/section.model';
import { Role } from '../../roles/shared/role.model';
import { Permission } from 'src/app/shared/permission.model';

export class User {
  id: number;
  code: string;
  fullname: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  roles: Role[];
  cycle: Cycle;
  grades: ShiftPeriodGrade[];
  section: Section;
  active: boolean;
  createdAt: any;
  permissions: Permission[];
}
