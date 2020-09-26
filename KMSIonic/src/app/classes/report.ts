import {User} from './user'
import {ReportType} from '../enum/report-type.enum'
import {Tag} from './tag'

export class Report {
    reportId: number;
    reportOwner: User;
    reportedUser: User;
    reportType: ReportType;
    reportContent: string;
    reportTags: Tag[];

    constructor(reportId?: number, reportOwner?: User, reportedUser?: User, reportType?: ReportType, reportContent?: string, reportTags?: Tag[]){
        this.reportId = reportId;
        this.reportOwner = reportOwner;
        this.reportedUser = reportedUser;
        this.reportType = reportType;
        this.reportContent = reportContent;
        this.reportTags = reportTags;
    }
}