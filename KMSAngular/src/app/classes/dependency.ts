import { Task } from './task';

export class Dependency {
    dependencyId: number;
    type: number;
    predecessor: Task;
    successor: Task;

    constructor(dependencyId?: number, type?: number, predecessor?: Task, successor?: Task) {
        this.dependencyId = dependencyId;
        this.type = type;
        this.predecessor = predecessor;
        this.successor = successor;
    }
}
