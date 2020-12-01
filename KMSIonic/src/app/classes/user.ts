import { Tag } from './tag';
import { MaterialResourceAvailable } from './material-resource-available';
import { AccountPrivacySettingEnum } from '../enum/account-privacy-setting.enum';
import { UserType } from '../enum/user-type.enum';
import { FollowRequest } from './follow-request';
import { AffiliationRequest } from './affiliation-request';
import { HumanResourcePosting } from './human-resource-posting';
import { Post } from './post';
import { Profile } from './profile';
import { ClaimProfileRequest } from './claim-profile-request';

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
  isActive: Boolean;
  affiliatedUsers: User[];
  affiliationRequestMade: AffiliationRequest[];
  affiliationRequestReceived: AffiliationRequest[];
  hrpApplied: HumanResourcePosting[];
  posts: Post[];
  likedPosts: Post[];
  profiles: Profile[];
  claimProfileRequestMade: ClaimProfileRequest[];

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
    accountPrivacySetting?: AccountPrivacySettingEnum,
    isActive?: Boolean,
    affiliatedUsers?: User[],
    affiliationRequestMade?: AffiliationRequest[],
    affiliationRequestReceived?: AffiliationRequest[],
    hrpApplied?: HumanResourcePosting[],
    posts?: Post[],
    likedPosts?: Post[],
    profiles?: Profile[],
    claimProfileRequestMade?: ClaimProfileRequest[]
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
    this.isActive = isActive;
    this.affiliatedUsers = affiliatedUsers;
    this.affiliationRequestMade = affiliationRequestMade;
    this.affiliationRequestReceived = affiliationRequestReceived;
    this.hrpApplied = hrpApplied;
    this.posts = posts;
    this.likedPosts = likedPosts;
    this.profiles = profiles;
    this.claimProfileRequestMade = claimProfileRequestMade;
  }
}
