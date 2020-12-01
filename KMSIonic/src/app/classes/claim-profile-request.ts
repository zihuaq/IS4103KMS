import { Profile } from './profile';
import { User } from './user';

export class ClaimProfileRequest {
  id: number;
  profile: Profile;
  user: User;

  constructor(id?: number, profile?: Profile, user?: User) {
    this.id = id;
    this.profile = profile;
    this.user = user;
  }
}
