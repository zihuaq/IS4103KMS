import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { review } from 'src/app/classes/review';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-reviews-written',
  templateUrl: './reviews-written.component.html',
  styleUrls: ['./reviews-written.component.css']
})
export class ReviewsWrittenComponent implements OnInit {

  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  reviewsWritten: review[];
  errorMessage: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getWrittenReviews(this.profile.userId).subscribe(
      response=>{
        this.reviewsWritten = response;
        console.log(this.reviewsWritten)
      },
      (error) =>{
        this.errorMessage = error
      }
    )
  }

}
