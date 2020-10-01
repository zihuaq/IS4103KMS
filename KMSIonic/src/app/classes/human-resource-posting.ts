import { Project } from './project';
import { Tag } from './tag';
import { User } from './user';

export class HumanResourcePosting {
    humanResourcePostingId: number;
    name: string;
    totalSlots: number;
    obtainedSlots: number;
    lackingSlots: number;
    description: string;
    startDate: Date;
    endDate: Date;
    latitude: number;
    longitude: number;
    project: Project;
    tags: Tag[];
    appliedUsers: User[];


    constructor(humanResourcePostingId?: number, name?: string, totalSlots?: number, obtainedSlots?: number, lackingSlots?: number, description?: string, startDate?: Date, endDate?: Date, latitude?: number, longitude?: number, project?: Project, tags?: Tag[], appliedUsers?: User[]) {
        this.humanResourcePostingId = humanResourcePostingId;
        this.name = name;
        this.totalSlots = totalSlots;
        this.obtainedSlots = obtainedSlots;
        this.lackingSlots = lackingSlots;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.project = project;
        this.tags = tags;
        this.appliedUsers = appliedUsers;
    }
}
