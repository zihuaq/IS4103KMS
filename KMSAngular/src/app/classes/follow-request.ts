import { User } from './user';

export class FollowRequest {
  id: number;
  to: User;
  from: User;

  constructor(id?: number, to?: User, from?: User) {
    this.id = id;
    this.to = to;
    this.from = from;
  }
}
