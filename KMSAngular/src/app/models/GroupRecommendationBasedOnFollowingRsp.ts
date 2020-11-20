import { Group } from '../classes/group';
import { User } from '../classes/user';

export class GroupRecommendationBasedOnFollowingRsp {
    groupToRecommend: Group;
    followingInGroup: User[];

    constructor(groupToRecommend?: Group, followingInGroup?: User[]) {
        this.groupToRecommend = groupToRecommend;
        this.followingInGroup = followingInGroup;
    }
}