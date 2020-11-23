import { Component, EventEmitter, Input, OnInit,Output } from '@angular/core';
import { SessionService } from 'src/app/session.service';
import { review } from '../../classes/review'

@Component({
  selector: 'app-reviews-item',
  templateUrl: './reviews-item.component.html',
  styleUrls: ['./reviews-item.component.css']
})
export class ReviewsItemComponent implements OnInit {

  @Input() review: review;
  @Output() reviewSelected = new EventEmitter<review>();
  loggedInUserId: number

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUserId = this.sessionService.getCurrentUser().userId
  }

  onSelectReport(){
    this.reviewSelected.emit(this.review);
  }

}
