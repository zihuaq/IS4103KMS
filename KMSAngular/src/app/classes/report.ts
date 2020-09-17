import {User} from './user'
import {ReportType} from './report-type.enum'

export class Report {
    reportId: number;
    reportOwner: User;
    reportedUser: User;
    reportType: ReportType;

    constructor(reportId?: number, reportOwner?: User, reportedUser?: User, reportType?: ReportType){
        this.reportId = reportId;
        this.reportOwner = reportOwner;
        this.reportedUser = reportedUser;
        this.reportType = reportType;
    }
}