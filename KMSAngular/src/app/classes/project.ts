import { User } from './user';
import { Tag } from './tag';
import { ProjectType } from './project-type.enum';

export class Project {
    projectId: number;
    name: string;
    description: string;
    status: ProjectType;
    dateCreated: Date;
    country: string;
    projectOwner: User;
    projectMembers: User[];
    projectAdmins: User[];
    monetaryFundingRequired: number;
    monetaryFundingObtained: number;
    sdgs: Tag[];

    constructor(projectId?: number, name?: string, description?: string, status?: ProjectType, dateCreated?: Date, country?: string, monetaryFundingRequired?: number, monetaryFundingObtained?: number, projectOwner?: User, projectMembers?: User[], projectAdmins?: User[], sdgs?: Tag[]) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.status = status;
        this.dateCreated = dateCreated;
        this.country = country;
        this.projectOwner = projectOwner;
        this.projectMembers = projectMembers;
        this.projectAdmins = projectAdmins;
        this.monetaryFundingObtained = monetaryFundingObtained;
        this.monetaryFundingRequired = monetaryFundingRequired;
        this.sdgs = sdgs;
    }
}
