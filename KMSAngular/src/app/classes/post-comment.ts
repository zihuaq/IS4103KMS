import { Post } from './post'
import { User } from './user'

export class PostComment {
    postCommentId: number;
    comment: string;
    dateTime: Date;
    post: Post;
    commentOwner: User;
    likers: User[];
    isActive: Boolean;

    constructor(postCommentId?: number, comment?: string, dateTime?: Date,
        post?: Post, commentOwner?: User, likers?: User[]) {
        this.postCommentId = postCommentId;
        this.comment = comment;
        this.dateTime = dateTime;
        this.post = post;
        this.commentOwner = commentOwner;
        this.likers = likers;
    }
}
