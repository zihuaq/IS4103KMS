import { Post } from './post';
import { User } from './user';
import { ElectionApplication } from './election-application';

export class Election {
  id: number;
  startDate: Date;
  endDate: Date;
  name: string;
  description: string;
  electionOwner: User;
  isActive: boolean;
  electionPosts: Post[];
  electionApplications: ElectionApplication[];
  numSlots: number;
  minRepPointsRequired: number;

  constructor(
    id?: number,
    startDate?: Date,
    endDate?: Date,
    name?: string,
    description?: string,
    electionOwner?: User,
    isActive?: boolean,
    electionPosts?: Post[],
    electionApplications?: ElectionApplication[],
    numSlots?: number,
    minRepPoints?: number
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
    this.numSlots = numSlots;
    this.minRepPointsRequired = minRepPoints;
  }
}
