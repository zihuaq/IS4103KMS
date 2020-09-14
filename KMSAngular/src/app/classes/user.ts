import { Tag } from './tag';
import { MaterialResourceAvailable } from './material-resource-available'

export class User {
  userId: number;
  firstName: String;
  lastName: String;
  dob: Date;
  gender: String;
  email: String;
  password: String;
  isAdmin: boolean;
  profilePicture: String;
  country: String;
  reputationPoints: number;
  type: String;
  joinedDate: Date;
  appoinmentDate: Date;
  followers: User[];
  following: User[];
  skills: Tag[];
  mras: MaterialResourceAvailable[];

  constructor(
    userId?: number,
    firstName?: String,
    lastName?: String,
    dob?: Date,
    gender?: String,
    email?: String,
    password?: String,
    profilePicture?: String,
    country?: String,
    reputationPoints?: number,
    type?: String,
    joinedDate?: Date,
    appoinmentDate?: Date,
    followers?: User[],
    following?: User[],
    skills?: Tag[],
    mras?: MaterialResourceAvailable[]
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
    this.appoinmentDate = appoinmentDate;
    this.followers = followers;
    this.following = following;
    this.skills = skills;
    this.mras = mras;
  }
}
