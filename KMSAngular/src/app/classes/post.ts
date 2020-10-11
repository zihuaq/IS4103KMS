import { User } from './user'
import { PostComment } from './post-comment'
import { Project } from './project'

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

    constructor(postId?: number, postDate?: Date, editDate?: Date, text?: string, picture?: string | ArrayBuffer, postOwner?: User,
        likers?: User[], sharedPosts?: Post[], originalPost?: Post, comments?: PostComment[], project?: Project) {
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
    }
}