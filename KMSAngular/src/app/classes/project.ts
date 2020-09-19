import { User } from './user';
import { Tag } from './tag';

export class Project {
    projectId: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    country: string;
    location: string;
    projectOwner: User;
    groupMembers: User[];
    projectAdmins: User[];
    monetaryFundingRequired: number;
    monetaryFundingObtained: number;
    sdgs: Tag[];

    constructor(projectId?: number, name?: string, description?: string, startDate?: Date, endDate?: Date, country?: string, location?: string, monetaryFundingRequired?: number, monetaryFundingObtained?: number, projectOwner?: User, groupMembers?: User[], projectAdmins?: User[], sdgs?: Tag[]) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.country = country;
        this.location = location;
        this.projectOwner = projectOwner;
        this.groupMembers = groupMembers;
        this.projectAdmins = projectAdmins;
        this.monetaryFundingObtained = this.monetaryFundingObtained;
        this.monetaryFundingRequired = this.monetaryFundingRequired;
        this.sdgs = sdgs;
    }
}
