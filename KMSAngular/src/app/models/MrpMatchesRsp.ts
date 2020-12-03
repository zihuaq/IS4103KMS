import { MaterialResourceAvailable } from '../classes/material-resource-available';

export class MrpMatchesRsp {
    mraToRecommend: MaterialResourceAvailable;
    percentageMatch: number;

    constructor(mraToRecommend?: MaterialResourceAvailable, percentageMatch?: number) {
        this.mraToRecommend = mraToRecommend;
        this.percentageMatch = percentageMatch;
    }
}