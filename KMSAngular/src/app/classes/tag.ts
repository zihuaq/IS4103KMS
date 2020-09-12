enum TagType {
    SKILL,
    SDG,
    MATERIALRESOURCE
}

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