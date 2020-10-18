import { Component, Input, OnInit } from '@angular/core';
import { review } from '../classes/review';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  @Input() reviews: review[];

  constructor() { }

  ngOnInit(): void {
  }

}
