import { TagType } from '../enum/tag-type.enum';
import { User } from './user';

export class TagRequest {
  tagRequestId: number;
  requestedName: string;
  requestedTagType: TagType;
  requestOwner: User;

  constructor(
    tagRequestId?: number,
    requestedName?: string,
    requestedTagType?: TagType,
    requestOwner?: User
  ) {
    this.tagRequestId = tagRequestId;
    this.requestedName = requestedName;
    this.requestedTagType = requestedTagType;
    this.requestOwner = requestOwner;
  }
}
