import { PostComment } from './post-comment';
import { Post } from './post';
import { Project } from './project';
import { User } from './user';
import { ReportType } from '../enum/report-type.enum';
import { Tag } from './tag';
import { Group } from './group';

export class Report {
  reportId: number;
  reportOwner: User;
  reportedUser: User;
  reportType: ReportType;
  reportContent: string;
  reportTags: Tag[];
  reportedProject: Project;
  reportedPost: Post;
  reportedComment: PostComment;
  reportedGroup: Group;
  resolved: boolean;
  verdictComments: string;

  constructor(
    reportId?: number,
    reportOwner?: User,
    reportedUser?: User,
    reportType?: ReportType,
    reportContent?: string,
    reportTags?: Tag[],
    reportedProject?: Project,
    reportedPost?: Post,
    reportedComment?: PostComment,
    reportedGroup?: Group,
    resolved?: boolean,
    verdictComments?: string
  ) {
    this.reportId = reportId;
    this.reportOwner = reportOwner;
    this.reportedUser = reportedUser;
    this.reportType = reportType;
    this.reportContent = reportContent;
    this.reportTags = reportTags;
    this.reportedProject = reportedProject;
    this.reportedPost = reportedPost;
    this.reportedComment = reportedComment;
    this.reportedGroup = reportedGroup;
    this.resolved = resolved;
    this.verdictComments = verdictComments;
  }
}
