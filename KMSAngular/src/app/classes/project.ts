import {User} from './user';

export class Project {
    projectId: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    country: string;
    location: string;
    owner: User;
    groupMembers: User[];
    admins: User[];
    monetaryFundingRequired: number;
    monetaryFundingObtained: number;

    constructor(projectId?: number, name?: string, description?: string, startDate?: Date, endDate?: Date, country?: string, location?: string, monetaryFundingRequired?: number, monetaryFundingObtained?: number) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.country = country;
        this.location = location;
        this.monetaryFundingObtained = this.monetaryFundingObtained;
        this.monetaryFundingRequired = this.monetaryFundingRequired;
    }
}
