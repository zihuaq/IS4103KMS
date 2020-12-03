import { Project } from '../classes/project';

export class ProjectMatchesRsp {
    matchingProject: Project;
    percentageMatch: number;

    constructor(matchingProject?: Project, percentageMatch?: number) {
        this.matchingProject = matchingProject;
        this.percentageMatch = percentageMatch;
    }
}