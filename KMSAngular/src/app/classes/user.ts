export class User {
  userId: Number;
  firstName: String;
  lastName: String;
  dateOfBirth: Date;
  gender: String;
  email: String;
  password: String;
  profilePicture: String;
  country: String;
  reputationPoiints: Number;
  isAdmin: Boolean;
  joinDate: Date;
  appoinmentDate: Date;
  followers: User[];
  following: User[];

  constructor(
    userId?: Number,
    firstName?: String,
    lastName?: String,
    dateOfBirth?: Date,
    gender?: String,
    email?: String,
    password?: String,
    profilePicture?: String,
    country?: String,
    reputationPoiints?: Number,
    isAdmin?: Boolean,
    joinDate?: Date,
    appoinmentDate?: Date,
    followers?: User[],
    following?: User[]
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
    this.country = country;
    this.reputationPoiints = reputationPoiints;
    this.isAdmin = isAdmin;
    this.joinDate = joinDate;
    this.appoinmentDate = appoinmentDate;
    this.followers = followers;
    this.following = following;
  }
}
