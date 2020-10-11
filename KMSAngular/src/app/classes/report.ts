import { User } from './user'
import { ReportType } from './report-type.enum'
import { Tag } from './tag'
import { Project } from './project';

export class Report {
    reportId: number;
    reportOwner: User;
    reportType: ReportType;
    reportedUser: User;
    reportedProject: Project;
    reportContent: string;
    reportTags: Tag[];
    resolved: Boolean;
    verdictComments: String;

    constructor(reportId?: number, reportOwner?: User, reportType?: ReportType, reportedUser?: User, reportedProject?: Project, reportContent?: string, reportTags?: Tag[],
      resolved?: Boolean, verdictComments?: String){
        this.reportId = reportId;
        this.reportOwner = reportOwner;
        this.reportType = reportType;
        this.reportedUser = reportedUser;
        this.reportedProject = reportedProject;
        this.reportContent = reportContent;
        this.reportTags = reportTags;
        this.resolved = resolved;
        this.verdictComments = verdictComments;
    }
}
