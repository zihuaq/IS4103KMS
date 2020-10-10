import { Project } from './project';
import { User } from './user';
import { HumanResourcePosting } from './human-resource-posting';
import { MaterialResourcePosting } from './material-resource-posting';

export class Activity {
    activityId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    country: string;
    location: string;
    description: string;
    project: Project;
    humanResourcePostings: HumanResourcePosting[];
    materialResourcePostings: MaterialResourcePosting[];
    joinedUsers: User[];

    constructor(
        activityId?: number,
        name?: string,
        startDate?: Date,
        endDate?: Date,
        country?: string,
        location?: string,
        description?: string,
        project?: Project,
        humanResourcePostings?: HumanResourcePosting[],
        materialResourcePostings?: MaterialResourcePosting[],
        joinedUsers?: User[]
    ) {
        this.activityId = activityId;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.country = country;
        this.location = location;
        this.description = description;
        this.project = project;
        this.humanResourcePostings = humanResourcePostings;
        this.materialResourcePostings = materialResourcePostings;
        this.joinedUsers = joinedUsers;
    }
}
