import { Post } from './post';
import { User } from './user';

export class ElectionApplicationEntity {
    id: number;
    startDate: Date;
    endDate: Date;
    name: string;
    description: string;
    electionOwner: User;
    isActive: boolean;
    electionPosts: Post[];
    electionApplications: ElectionApplicationEntity[];

    constructor(
        id?: number,
        startDate?: Date,
        endDate?: Date,
        name?: string,
        description?: string,
        electionOwner?: User,
        isActive?: boolean,
        electionPosts?: Post[],
        electionApplications?: ElectionApplicationEntity[]
    ) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.name = name;
        this.description = description;
        this.electionOwner = electionOwner;
        this.isActive = isActive;
        this.electionPosts = electionPosts;
        this.electionApplications = electionApplications;
    }
}