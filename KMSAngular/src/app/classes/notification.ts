import { User } from './user';

export class Notification {
    notificationId: number;
    msg: string;
    projectId: number;
    groupId: number;
    to: User;

    constructor(notificationId?: number, msg?: string, projectId?: number, groupId?: number, to?: User, hasRead?: boolean, date?: Date) {
        this.notificationId = notificationId;
        this.msg = msg;
        this.projectId = projectId;
        this.groupId = groupId;
        this.to = to;
    }

}
