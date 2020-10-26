import { User } from "./user"
import { ReportType } from "../enum/report-type.enum"
import { Tag } from "./tag"
import { Project } from './project'

export class Report {
  reportId: number
  reportOwner: User
  reportedUser: User
  reportType: ReportType
  reportedProject: Project
  reportContent: string
  reportTags: Tag[]
  verdictComments: String
  resolved: boolean

  constructor(
    reportId?: number,
    reportOwner?: User,
    reportedUser?: User,
    reportType?: ReportType,
    reportedProject?: Project,
    reportContent?: string,
    reportTags?: Tag[],
    verdictComments?: String,
    resolved?: boolean
  ) {
    this.reportId = reportId
    this.reportOwner = reportOwner
    this.reportedUser = reportedUser
    this.reportType = reportType
    this.reportedProject = reportedProject
    this.reportContent = reportContent
    this.reportTags = reportTags
    this.verdictComments = verdictComments
    this.resolved = resolved

  }
}
