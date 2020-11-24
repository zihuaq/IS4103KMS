import { User } from './user';

export class Notification {
    notificationId: number;
    msg: string;
    projectId: number;
    groupId: number;
    to: User;
    tabName: string;

    constructor(notificationId?: number, msg?: string, projectId?: number, groupId?: number, to?: User, tabName?: string) {
        this.notificationId = notificationId;
        this.msg = msg;
        this.projectId = projectId;
        this.groupId = groupId;
        this.to = to;
        this.tabName = tabName;
    }

}
