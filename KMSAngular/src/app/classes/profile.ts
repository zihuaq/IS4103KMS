import { ClaimProfileRequest } from './claim-profile-request';
import { Tag } from './tag';
import { User } from './user';

export class Profile {
  id: number;
  name: String;
  organization: String;
  productsOrServices: String;
  description: String;
  industry: String;
  website: String;
  sdgs: Tag[];
  sdgTargets: Tag[];
  targetPopulation: String;
  focusRegions: String;
  region: String;
  country: String;
  cityState: String;
  yearOfEstablishment: String;
  contactDetails: String;
  userEntity: User;
  claimProfileRequestMade: ClaimProfileRequest[];

  constructor(
    id?: number,
    name?: String,
    organization?: String,
    productsOrServices?: String,
    description?: String,
    industry?: String,
    website?: String,
    sdgs?: Tag[],
    sdgTargets?: Tag[],
    targetPopulation?: String,
    focusRegions?: String,
    region?: String,
    country?: String,
    cityState?: String,
    yearOfEstablishment?: String,
    contactDetails?: String,
    userEntity?: User,
    claimProfileRequestMade?: ClaimProfileRequest[]
  ) {
    this.id = id;
    this.name = name;
    this.organization = organization;
    this.productsOrServices = productsOrServices;
    this.description = description;
    this.industry = industry;
    this.website = website;
    this.sdgs = sdgs;
    this.sdgTargets = sdgTargets;
    this.targetPopulation = targetPopulation;
    this.focusRegions = focusRegions;
    this.region = region;
    this.country = country;
    this.cityState = cityState;
    this.yearOfEstablishment = yearOfEstablishment;
    this.contactDetails = contactDetails;
    this.userEntity = userEntity;
    this.claimProfileRequestMade = claimProfileRequestMade;
  }
}
