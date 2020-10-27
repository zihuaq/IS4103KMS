import { Project } from './project';
import { User } from './user';
import { HumanResourcePosting } from './human-resource-posting';
import { MaterialResourcePosting } from './material-resource-posting';
import { ActivityStatus } from './activity-status.enum';

export class Activity {
    activityId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    country: string;
    latitude: number;
    longitude: number;
    description: string;
    activityStatus: ActivityStatus;
    allocatedQuantities: Map<number, number>;
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
        latitude?: number,
        longitude?: number,
        description?: string,
        activityStatus?: ActivityStatus,
        allocatedQuantities?: Map<number, number>,
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
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.activityStatus = activityStatus;
        this.allocatedQuantities = allocatedQuantities;
        this.project = project;
        this.humanResourcePostings = humanResourcePostings;
        this.materialResourcePostings = materialResourcePostings;
        this.joinedUsers = joinedUsers;
    }
}
