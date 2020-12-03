import { Tag } from './tag';
import { MaterialResourceAvailable } from './material-resource-available';
import { AccountPrivacySettingEnum } from './privacy-settings.enum';
import { UserType } from './user-type.enum';
import { FollowRequest } from './follow-request';
import { AffiliationRequest } from './affiliation-request';
import { HumanResourcePosting } from './human-resource-posting';
import { Post } from './post';
import { Project } from './project';
import { Activity } from './activity';
import { Group } from './group';
import { Award } from './award';
import { Profile } from './profile';
import { ClaimProfileRequest } from './claim-profile-request';
import { IndividualQuestionnaire } from './individualQuestionnaire';
import { OrganisationQuestionnaire } from './organisationQuestionnaire';

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
  projectsJoined: Project[];
  activityJoined: Activity[];
  groupsJoined: Group[];
  recievedAwards: Award[];
  countOfGroupsJoined: number;
  countOfProjectsJoined: number;
  countOfProjectsCreated: number;
  countOfGroupsCreated: number;
  countOfActivitiesCompleted: number;
  countOfPostCreated: number;
  countOfCommentsCreated: number;
  countOfReviewsCreated: number;
  profiles: Profile[];
  claimProfileRequestMade: ClaimProfileRequest[];
  completedQuestionnaire: boolean
  individualQuestionnaire: IndividualQuestionnaire
  organisationQuestionnaire: OrganisationQuestionnaire

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
    projectsJoined?: Project[],
    activityJoined?: Activity[],
    groupsJoined?: Group[],
    profiles?: Profile[],
    claimProfileRequestMade?: ClaimProfileRequest[],
    completedQuestionnaire?: boolean,
    individualQuestionnaire?: IndividualQuestionnaire,
    organisationQuestionnaire?: OrganisationQuestionnaire,
    countOfGroupsJoined?: number,
    countOfProjectsJoined?: number,
    countOfProjectsCreated?: number,
    countOfGroupsCreated?: number,
    countOfActivitiesCompleted?: number,
    countOfPostCreated?: number,
    countOfCommentsCreated?: number,
    countOfReviewsCreated?: number
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
    this.projectsJoined = projectsJoined;
    this.activityJoined = activityJoined;
    this.groupsJoined = groupsJoined;
    this.profiles = profiles;
    this.claimProfileRequestMade = claimProfileRequestMade;
    this.completedQuestionnaire = completedQuestionnaire
    this.individualQuestionnaire = individualQuestionnaire
    this.organisationQuestionnaire = organisationQuestionnaire
    this.countOfGroupsJoined = countOfGroupsJoined
    this.countOfProjectsJoined = countOfProjectsJoined
    this.countOfProjectsCreated = countOfProjectsCreated
    this.countOfGroupsCreated = countOfGroupsCreated
    this.countOfActivitiesCompleted = countOfActivitiesCompleted
    this.countOfPostCreated = countOfPostCreated
    this.countOfCommentsCreated = countOfCommentsCreated
    this.countOfReviewsCreated = countOfReviewsCreated
  }
}
