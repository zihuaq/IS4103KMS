export class Task {
    taskId: number;
    title: String;
    startDate: Date;
    endDate: Date;
    progress: number;
    parent: Task;

    constructor(taskId?: number, title?: String, startDate?: Date, endDate?: Date, progress?: number, parent?: Task) {
        this.taskId = taskId;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.progress = progress;
        this.parent = parent;
    }
}
