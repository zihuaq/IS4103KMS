import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { review } from 'src/app/classes/review';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-reviews-recieved',
  templateUrl: './reviews-recieved.component.html',
  styleUrls: ['./reviews-recieved.component.css']
})
export class ReviewsRecievedComponent implements OnInit {

  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  reviewsRecieved: review[];
  errorMessage: string;
  averageReviewRating: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRecievedReviews(this.profile.userId).subscribe(
      (response)=>{
        this.reviewsRecieved = response;
        let totalReview = 0
        if(this.reviewsRecieved.length > 0){
          for(let review of this.reviewsRecieved){
            totalReview += review.rating
          }
          this.averageReviewRating = totalReview/this.reviewsRecieved.length
        }
      },
      (error) =>{
        this.errorMessage = error
      }
    )
  }

}
