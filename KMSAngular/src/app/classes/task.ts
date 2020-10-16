export class Task {
    id: number;
    text: String;
    start_date: Date;
    end_date: Date;
    progress: number;
    parent: number;

    constructor(id?: number, text?: String, start_date?: Date, end_date?: Date, progress?: number, parent?: number) {
        this.id = id;
        this.text = text;
        this.start_date = start_date;
        this.end_date = end_date;
        this.progress = progress;
        this.parent = parent;
    }
}
