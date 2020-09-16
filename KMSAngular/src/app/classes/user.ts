import { Tag } from './tag';
import { MaterialResourceAvailable } from './material-resource-available';
import { AccountPrivacySettingEnum } from './privacy-settings.enum';

export class User {
  userId: number;
  firstName: String;
  lastName: String;
  dob: Date;
  gender: String;
  email: String;
  password: String;
  isAdmin: boolean;
  profilePicture: string | ArrayBuffer;
  country: String;
  reputationPoints: number;
  type: String;
  joinedDate: Date;
  adminStartDate: Date;
  followers: User[];
  following: User[];
  skills: Tag[];
  mras: MaterialResourceAvailable[];
  sdgs: Tag[];
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
    type?: String,
    joinedDate?: Date,
    adminStartDate?: Date,
    followers?: User[],
    following?: User[],
    skills?: Tag[],
    mras?: MaterialResourceAvailable[],
    sdgs?: Tag[],
    accountPrivacySetting?: AccountPrivacySettingEnum
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob = dob;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.profilePicture = profilePicture;
    this.country = country;
    this.reputationPoints = reputationPoints;
    this.type = type;
    this.joinedDate = joinedDate;
    this.adminStartDate = adminStartDate;
    this.followers = followers;
    this.following = following;
    this.skills = skills;
    this.mras = mras;
    this.sdgs = sdgs;
    this.accountPrivacySetting = accountPrivacySetting;
  }
}
