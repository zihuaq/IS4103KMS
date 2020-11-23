import { User } from "./user";
import { Project } from "./project";
import { Activity } from './activity';

export class review{

  reviewId: number;
  to: User;
  from: User;
  project: Project;
  madeFromActivity: Activity
  title: String;
  reviewField: String;
  rating: number;

  constructor(
    reviewId?: number,
    to?: User,
    from?: User,
    project?: Project,
    madeFromActivity?: Activity,
    title?: String,
    reviewField?: String,
    rating?: number){
      this.reviewId = reviewId;
      this.to = to;
      this.from = from;
      this.project = project;
      this.madeFromActivity = madeFromActivity;
      this.title = title;
      this.reviewField = reviewField
      this.rating = rating
  }

}
