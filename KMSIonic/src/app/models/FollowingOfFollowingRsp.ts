import { User } from '../classes/user';

export class FollowingOfFollowingRsp {
  userToRecommend: User;
  usersFollowing: User[];

  constructor(userToRecommend?: User, usersFollowing?: User[]) {
    this.userToRecommend = userToRecommend;
    this.usersFollowing = usersFollowing;
  }
}
