export class OrganisationQuestionnaire {
  organisationQuestionnaireId: number;
  awareOfSDG: string;
  workingOnSDG: string[];
  workingOnTargets: string[];
  partOfSocialImpactNetwork: string[]

  constructor(
    organisationQuestionnaireId?: number,
    awareOfSDG?: string,
    workingOnSDG?: string[],
    workingOnTargets?: string[],
    partOfSocialImpactNetwork?: string[]
  ) {
    this.organisationQuestionnaireId = organisationQuestionnaireId
    this.awareOfSDG = awareOfSDG
    this.workingOnSDG = workingOnSDG
    this.workingOnTargets = workingOnTargets
    this.partOfSocialImpactNetwork = partOfSocialImpactNetwork
  }
}
