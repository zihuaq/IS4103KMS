import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit, OnChanges {
  @Input() profile: User;

  constructor() {}
  ngOnChanges(): void {}

  ngOnInit(): void {}
}
