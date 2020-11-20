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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRecievedReviews(this.profile.userId).subscribe(
      (response)=>{
        this.reviewsRecieved = response;
      },
      (error) =>{
        this.errorMessage = error
      }
    )
  }

}
