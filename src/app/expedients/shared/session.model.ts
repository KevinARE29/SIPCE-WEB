export class Session {
    id: number;
    sessionType: string;
    serviceType: string;
    startedAt: Date;
    finishedAt: Date;
    duration: number;
    comments: string;
    treatedTopics: string[];
    agreements: string[];
    draft: boolean;
}
