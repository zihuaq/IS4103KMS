import { User } from './user';
import { Tag } from './tag';
import { GroupType } from './group-type.enum';
import { HumanResourcePosting } from './human-resource-posting';
import { MaterialResourcePosting } from './material-resource-posting';

export class Group {
    groupId: number;
    name: string;
    // description: string;
    status: GroupType;
    dateCreated: Date;
    profilePicture: string | ArrayBuffer;
    country: string;
    groupOwner: User;
    groupMembers: User[];
    groupAdmins: User[];
    // monetaryFundingRequired: number;
    // monetaryFundingObtained: number;
    // sdgs: Tag[];
    // humanResourcePostings: HumanResourcePosting[];
    // materialResourcePostings: MaterialResourcePosting[];

    constructor(
        groupId?: number, 
        name?: string, 
        // description?: string, 
        status?: GroupType, 
        dateCreated?: Date, 
        profilePicture?: string | ArrayBuffer, 
        country?: string,
        // monetaryFundingRequired?: number, 
        // monetaryFundngObtained?: number, 
        groupOwner?: User, 
        groupMembers?: User[], 
        groupAdmins?: User[], 
        // sdgs?: Tag[],
        // humanResourcePostings?: HumanResourcePosting[],
        // materialResourcePostings?: MaterialResourcePosting[]
        ) 
        {
            this.groupId = groupId;
            this.name = name;
            //this.description = description;
            this.status = status;
            this.dateCreated = dateCreated;
            this.profilePicture = profilePicture;
            this.country = country;
            this.groupOwner = groupOwner;
            this.groupMembers = groupMembers;
            this.groupAdmins = groupAdmins;
            // this.monetaryFundingObtained = monetaryFundingObtained;
            // this.monetaryFundingRequired = monetaryFundingRequired;
            // this.sdgs = sdgs;
            // this.humanResourcePostings = humanResourcePostings;
            // this.materialResourcePostings = materialResourcePostings;
    }
}
