import { Post } from '../classes/post'

export class SharePostToProjectOrGroupsReq {
    postDate: Date;
    text: string;
    projectsOrGroupsIds: number[];

    constructor( postDate?: Date, text?: string, projectsOrGroupsIds?: number[]){
        this.postDate = postDate;
        this.text = text;
        this.projectsOrGroupsIds = projectsOrGroupsIds;
    }
}