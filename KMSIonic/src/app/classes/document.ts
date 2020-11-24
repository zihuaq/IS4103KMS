export class Document {
    key: string;
    author: string;
    description: string;
    timeStamp: string;

    constructor(key?: string, author?: string, description?: string, timeStamp?: string) {
        this.key = key;
        this.author = author;
        this.description = description;
        this.timeStamp = timeStamp;
    }
}
