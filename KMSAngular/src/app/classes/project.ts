import { User } from './user';
import { Tag } from './tag';
import { ProjectType } from './project-type.enum';

export class Project {
    projectId: number;
    name: string;
    description: string;
    status: ProjectType;
    startDate: Date;
    endDate: Date;
    country: string;
    projectOwner: User;
    groupMembers: User[];
    projectAdmins: User[];
    monetaryFundingRequired: number;
    monetaryFundingObtained: number;
    sdgs: Tag[];

    constructor(projectId?: number, name?: string, description?: string, status?: ProjectType, startDate?: Date, endDate?: Date, country?: string, monetaryFundingRequired?: number, monetaryFundingObtained?: number, projectOwner?: User, groupMembers?: User[], projectAdmins?: User[], sdgs?: Tag[]) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.country = country;
        this.projectOwner = projectOwner;
        this.groupMembers = groupMembers;
        this.projectAdmins = projectAdmins;
        this.monetaryFundingObtained = this.monetaryFundingObtained;
        this.monetaryFundingRequired = this.monetaryFundingRequired;
        this.sdgs = sdgs;
    }
}
