import { User } from './user';

export class ElectionApplication {
  id: number;
  applicationDate: Date;
  reasons: string;
  contributions: string;
  applicationOwner: User;

  constructor(
    id?: number,
    applicationDate?: Date,
    reasons?: string,
    contributions?: string,
    applicationOwner?: User,
  ) {
    this.id = id;
    this.applicationDate = applicationDate;
    this.reasons = reasons;
    this.contributions = contributions;
    this.applicationOwner = applicationOwner;
  }
}
