import { Component, Input, OnInit } from '@angular/core';
import { review } from '../../classes/review'

@Component({
  selector: 'app-reviews-item',
  templateUrl: './reviews-item.component.html',
  styleUrls: ['./reviews-item.component.css']
})
export class ReviewsItemComponent implements OnInit {

  @Input() review: review;

  constructor() { }

  ngOnInit(): void {
  }

}
