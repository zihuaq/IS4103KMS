

export class IndividualQuestionnaire {
  individualQuestionnaireId: number;
  awareOfSDG: string;
  passionateSDG: string[];
  passionateTargets: string[];
  firstTimeOnSDG: boolean;
  partOfSocialImpactNetwork: string[]

  constructor(
    individualQuestionnaireId?: number,
    awareOfSDG?: string,
    passionateSDG?: string[],
    passionateTargets?: string[],
    firstTimeOnSDG?: boolean,
    partOfSocialImpactNetwork?: string[]
  ) {
    this.individualQuestionnaireId = individualQuestionnaireId
    this.awareOfSDG = awareOfSDG
    this.passionateSDG = passionateSDG
    this.passionateTargets = passionateTargets
    this.firstTimeOnSDG = firstTimeOnSDG
    this.partOfSocialImpactNetwork = partOfSocialImpactNetwork
  }
}


