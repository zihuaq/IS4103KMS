import { User } from './user'
import { ReportType } from './report-type.enum'
import { Tag } from './tag'
import { Project } from './project';
import { Group } from './group';

export class Report {
    reportId: number;
    reportOwner: User;
    reportType: ReportType;
    reportedUser: User;
    reportedProject: Project;
    reportedGroup: Group;
    reportContent: string;
    reportTags: Tag[];
    resolved: boolean;
    verdictComments: String;

    constructor(reportId?: number, reportOwner?: User, reportType?: ReportType, reportedUser?: User, reportedProject?: Project, reportedGroup?: Group, reportContent?: string, reportTags?: Tag[],
      resolved?: boolean, verdictComments?: String){
        this.reportId = reportId;
        this.reportOwner = reportOwner;
        this.reportType = reportType;
        this.reportedUser = reportedUser;
        this.reportedProject = reportedProject;
        reportedGroup: Group;
        this.reportContent = reportContent;
        this.reportTags = reportTags;
        this.resolved = resolved;
        this.verdictComments = verdictComments;
    }
}
