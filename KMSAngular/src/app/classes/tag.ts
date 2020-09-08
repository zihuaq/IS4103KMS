enum TagType {
    SKILL,
    SDG,
    MATERIALRESOURCE
}

export class Tag {
    tagId: number;
    name: string;
    type: TagType;

    constructor(tagId?: number, name?: string, type?:TagType){
        this.tagId = tagId;
        this.name = name;
        this.type = type;
    }
}