import { Tag } from './tag';

export class User {
  userId: Number;
  firstName: String;
  lastName: String;
  dob: Date;
  gender: String;
  email: String;
  password: String;
  isAdmin: boolean;
  profilePicture: String;
  country: String;
  reputationPoints: Number;
  type: String;
  joinedDate: Date;
  appoinmentDate: Date;
  followers: User[];
  following: User[];
  skills: Tag[];
  mras: Tag[];

  constructor(
    userId?: Number,
    firstName?: String,
    lastName?: String,
    dob?: Date,
    gender?: String,
    email?: String,
    password?: String,
    profilePicture?: String,
    country?: String,
    reputationPoints?: Number,
    type?: String,
    joinedDate?: Date,
    appoinmentDate?: Date,
    followers?: User[],
    following?: User[],
    skills?: Tag[],
    mras?: Tag[]
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
