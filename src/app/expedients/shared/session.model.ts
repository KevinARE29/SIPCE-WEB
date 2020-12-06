import { User } from '../../users/shared/user.model';
import { Responsible } from 'src/app/students/shared/responsible.model';
import { InterventionProgram } from './intervention-program.model';

export class Evaluation {
  id: number;
  description: string;
}

class ResponsibleAttendance {
  id: number;
  attended: boolean;
}

export class Session {
  id: number;
  identifier: number;

  sessionType: string;
  serviceType: string;
  draft: boolean;
  startedAt: Date;
  duration: number;
  comments: string;
  evaluations: Evaluation[];

  // Filter field
  finishedAt: Date;

  // Individual session response
  interventionProgram: InterventionProgram;

  // Individual session request
  interventionProgramId: number;

  // Teacher interview request
  participants: number[];

  // Teacher interview response
  counselor: User[];

  // Responsible interview
  startHour: Date;
  treatedTopics: string;
  agreements: string;

  // Responsible interview request
  responsibles: ResponsibleAttendance[];
  otherResponsible: {
    otherResponsibleName: string;
    otherResponsibleRelationship: string;
  };

  // Responsible interview response
  sessionResponsibleAssistence: {
    responsible1Assistence: boolean;
    responsible2Assistence: boolean;
    otherResponsibleName: boolean;
    otherResponsibleRelationship: string;
    responsible1: Responsible;
    responsible2: Responsible;
  };

  // To create report
  startDateString: string;
  finishAt: Date;
  expedient: {
    gradeDetail: {
      counselor: User;
    };
  };
}
