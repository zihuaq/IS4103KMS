import {TagType} from './tag-type.enum'

export class Tag {
    tagId: number;
    name: string;
    tagType: TagType;

    constructor(tagId?: number, name?: string, tagType?:TagType){
        this.tagId = tagId;
        this.name = name;
        this.tagType = tagType;
    }
}