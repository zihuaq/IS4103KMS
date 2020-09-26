import { Tag } from './tag';
import { MaterialResourceAvailable } from './material-resource-available';
import { AccountPrivacySettingEnum } from './privacy-settings.enum';
import { UserType } from './user-type.enum';
import { FollowRequest } from './follow-request';

export class User {
  userId: number;
  firstName: String;
  lastName: String;
  dob: Date;
  gender: String;
  email: String;
  password: String;
  userType: UserType;
  profilePicture: string | ArrayBuffer;
  country: String;
  reputationPoints: number;
  joinedDate: Date;
  adminStartDate: Date;
  followers: User[];
  following: User[];
  skills: Tag[];
  mras: MaterialResourceAvailable[];
  sdgs: Tag[];
  followRequestMade: FollowRequest[];
  followRequestReceived: FollowRequest[];
  accountPrivacySetting: AccountPrivacySettingEnum;

  constructor(
    userId?: number,
    firstName?: String,
    lastName?: String,
    dob?: Date,
    gender?: String,
    email?: String,
    password?: String,
    profilePicture?: string | ArrayBuffer,
    country?: String,
    reputationPoints?: number,
    userType?: UserType,
    joinedDate?: Date,
    adminStartDate?: Date,
    followers?: User[],
    following?: User[],
    skills?: Tag[],
    mras?: MaterialResourceAvailable[],
    sdgs?: Tag[],
    followRequestMade?: FollowRequest[],
    followRequestReceived?: FollowRequest[],
    accountPrivacySetting?: AccountPrivacySettingEnum
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob = dob;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.userType = userType;
    this.profilePicture = profilePicture;
    this.country = country;
    this.reputationPoints = reputationPoints;
    this.joinedDate = joinedDate;
    this.adminStartDate = adminStartDate;
    this.followers = followers;
    this.following = following;
    this.skills = skills;
    this.mras = mras;
    this.sdgs = sdgs;
    this.followRequestMade = followRequestMade;
    this.followRequestReceived = followRequestReceived;
    this.accountPrivacySetting = accountPrivacySetting;
  }
}
