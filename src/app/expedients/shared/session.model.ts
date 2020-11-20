class Evaluation {
    id: number;
    description: string;
}

class Responsible {
    id: number;
    attended: boolean;
}

class OtherResponsible {
    otherResponsibleName: string;
    otherResponsibleRelationship: string;
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

    // Teach interview form.
    participants: number[];

    // Responsible interview
    startHour: Date;
    treatedTopics: string;
    agreements: string;

    // Responsible interview form
    responsibles: Responsible[];
    otherResponsible: OtherResponsible;
}
