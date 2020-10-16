
export class Link {
    id: number;
    source: number;
    target: number;
    type: number;

    constructor(linkId?: number, source?: number, target?: number, type?: number) {
        this.id = linkId;
        this.source = source;
        this.target = target;
        this.type = type;
    }
}
