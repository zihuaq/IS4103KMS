import { User } from './user';
import { Post } from './post';

export class Group {
  groupId: number;
  name: string;
  description: string;
  country: string;
  profilePicture: string | ArrayBuffer;
  groupOwner: User;
  groupMembers: User[];
  groupAdmins: User[];
  posts: Post[];

  constructor(
    groupId?: number,
    name?: string,
    description?: string,
    country?: string,
    profilePicture?: string | ArrayBuffer,
    groupOwner?: User,
    groupMembers?: User[],
    groupAdmins?: User[],
    posts?: Post[]
  ) {
    this.groupId = groupId;
    this.name = name;
    this.description = description;
    this.country = country;
    this.profilePicture = profilePicture;
    this.groupOwner = groupOwner;
    this.groupMembers = groupMembers;
    this.groupAdmins = groupAdmins;
    this.posts = posts;
  }
}
