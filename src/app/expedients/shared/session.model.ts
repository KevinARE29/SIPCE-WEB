class Evaluation {
    id: number;
    description: string;
}

export class Session {
    id: number;
    identifier: number;
    sessionType: string;
    serviceType: string;

    draft: boolean;
    startedAt: Date;
    finishedAt: Date;
    duration: number;
    comments: string;
    treatedTopics: string[];
    agreements: string;
    evaluations: Evaluation[];
    participants: number[];
}
