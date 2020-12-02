import { Election } from './election';
import { User } from './user';

export class ElectionApplication {
  id: number;
  applicationDate: Date;
  reasons: string;
  contributions: string;
  applicationOwner: User;
  additionalComments: string;
  election: Election;

  constructor(
    id?: number,
    applicationDate?: Date,
    reasons?: string,
    contributions?: string,
    applicationOwner?: User,
    additionalComments?: string,
    election?: Election
  ) {
    this.id = id;
    this.applicationDate = applicationDate;
    this.reasons = reasons;
    this.contributions = contributions;
    this.applicationOwner = applicationOwner;
    this.additionalComments = additionalComments;
    this.election = election;
  }
}
