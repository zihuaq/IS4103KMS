import { Project } from '../classes/project';
import { User } from '../classes/user';

export class GroupRecommendationBasedOnFollowingRsp {
    projectToRecommend: Project;
    followingInProject: User[];

    constructor(projectToRecommend?: Project, followingInProject?: User[]) {
        this.projectToRecommend = projectToRecommend;
        this.followingInProject = followingInProject;
    }
}