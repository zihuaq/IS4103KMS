import { User } from './user';
import { Tag } from './tag';
import { ProjectType } from '../enum/project-type.enum';
import { HumanResourcePosting } from './human-resource-posting';
import { MaterialResourcePosting } from './material-resource-posting';
import { Post } from './post';

export class Project {
  projectId: number;
  name: string;
  description: string;
  status: ProjectType;
  dateCreated: Date;
  country: string;
  profilePicture: string | ArrayBuffer;
  projectOwner: User;
  projectMembers: User[];
  projectAdmins: User[];
  monetaryFundingRequired: number;
  monetaryFundingObtained: number;
  paypalEmail: string;
  sdgs: Tag[];
  humanResourcePostings: HumanResourcePosting[];
  materialResourcePostings: MaterialResourcePosting[];
  posts: Post[];

  constructor(
    projectId?: number,
    name?: string,
    description?: string,
    status?: ProjectType,
    dateCreated?: Date,
    country?: string,
    profilePicture?: string | ArrayBuffer,
    monetaryFundingRequired?: number,
    monetaryFundingObtained?: number,
    paypalEmail?: string,
    projectOwner?: User,
    projectMembers?: User[],
    projectAdmins?: User[],
    sdgs?: Tag[],
    humanResourcePostings?: HumanResourcePosting[],
    materialResourcePostings?: MaterialResourcePosting[],
    posts?: Post[]
  ) {
    this.projectId = projectId;
    this.name = name;
    this.description = description;
    this.status = status;
    this.dateCreated = dateCreated;
    this.country = country;
    this.profilePicture = profilePicture;
    this.projectOwner = projectOwner;
    this.projectMembers = projectMembers;
    this.projectAdmins = projectAdmins;
    this.monetaryFundingObtained = monetaryFundingObtained;
    this.monetaryFundingRequired = monetaryFundingRequired;
    this.paypalEmail = paypalEmail;
    this.sdgs = sdgs;
    this.humanResourcePostings = humanResourcePostings;
    this.materialResourcePostings = materialResourcePostings;
    this.posts = posts;
  }
}
