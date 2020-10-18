import { User } from './user';
import { Tag } from './tag';

export class Group {
  groupId: number;
  name: string;
  description: string;
  country: string;
  profilePicture: string | ArrayBuffer;
  groupOwner: User;
  groupMembers: User[];
  groupAdmins: User[];
  sdgs: Tag[];

  constructor(
      groupId?: number,
      name?: string,
      description?: string,
      country?: string,
      profilePicture?: string | ArrayBuffer,
      groupOwner?: User,
      groupMembers?: User[],
      groupAdmins?: User[],
      sdgs?: Tag[])
      {
      this.groupId = groupId;
      this.name = name;
      this.description = description;
      this.country = country;
      this.profilePicture = profilePicture;
      this.groupOwner = groupOwner;
      this.groupMembers = groupMembers;
      this.groupAdmins = groupAdmins;
      this.sdgs = sdgs;
  }
}
