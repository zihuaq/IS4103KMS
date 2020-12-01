import { User } from './user';
import { PostComment } from './post-comment';
import { Project } from './project';
import { Group } from './group';
import { Election } from './election';

export class Post {
  postId: number;
  postDate: Date;
  editDate: Date;
  text: string;
  picture: string | ArrayBuffer;
  postOwner: User;
  likers: User[];
  sharedPosts: Post[];
  originalPost: Post;
  comments: PostComment[];
  project: Project;
  originalPostDeleted: boolean;
  group: Group;
  isActive: boolean;
  sharedGroupId: string;
  sharedProjectId: string;
  sharedGroupOrProjectDescription: string;
  sharedGroupOrProjectName: string;
  isPinnedPost: boolean;
  isElectionPost: boolean;
  endorser: User;
  election: Election;

  constructor(
    postId?: number,
    postDate?: Date,
    editDate?: Date,
    text?: string,
    picture?: string | ArrayBuffer,
    postOwner?: User,
    likers?: User[],
    sharedPosts?: Post[],
    originalPost?: Post,
    comments?: PostComment[],
    project?: Project,
    originalPostDeleted?: boolean,
    group?: Group,
    sharedGroupId?: string,
    sharedProjectId?: string,
    sharedGroupOrProjectDescription?: string,
    sharedGroupOrProjectName?: string,
    isPinnedPost?: boolean,
    isElectionPost?: boolean,
    endorser?: User,
    election?: Election
  ) {
    this.postId = postId;
    this.postDate = postDate;
    this.editDate = editDate;
    this.text = text;
    this.picture = picture;
    this.postOwner = postOwner;
    this.likers = likers;
    this.sharedPosts = sharedPosts;
    this.originalPost = originalPost;
    this.comments = comments;
    this.project = project;
    this.originalPostDeleted = originalPostDeleted;
    this.group = group;
    this.sharedGroupId = sharedGroupId;
    this.sharedProjectId = sharedProjectId;
    this.sharedGroupOrProjectDescription = sharedGroupOrProjectDescription;
    this.sharedGroupOrProjectName = sharedGroupOrProjectName;
    this.isPinnedPost = isPinnedPost;
    this.isElectionPost = isElectionPost;
    this.endorser = endorser;
    this.election = election;
  }
}
