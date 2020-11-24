export class Badge {
  badgeId: number;
  name: string;
  description: string;
  tierOneRequirement: number;
  tierTwoRequirement: number;
  tierThreeRequirement: number;
  tierZeroPicture: string | ArrayBuffer;
  tierOnePicture: string | ArrayBuffer;
  tierTwoPicture: string | ArrayBuffer;
  tierThreePicture: string | ArrayBuffer;

  constructor(
    badgeId?: number,
    name?: string,
    description?: string,
    tierOneRequirement?: number,
    tierTwoRequirement?: number,
    tierThreeRequirement?: number,
    tierZeroPicture?: string | ArrayBuffer,
    tierOnePicture?: string | ArrayBuffer,
    tierTwoPicture?: string | ArrayBuffer,
    tierThreePicture?: string | ArrayBuffer

  ) {
    this.badgeId = badgeId;
    this.name = name;
    this.description = description;
    this.tierOneRequirement = tierOneRequirement;
    this.tierTwoRequirement = tierTwoRequirement;
    this.tierThreeRequirement = tierThreeRequirement;
    this.tierZeroPicture = tierZeroPicture;
    this.tierOnePicture = tierOnePicture;
    this.tierTwoPicture = tierTwoPicture;
    this.tierThreePicture = tierThreePicture;
  }
}
