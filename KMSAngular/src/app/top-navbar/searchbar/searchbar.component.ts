import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Input() searchString: string;
  @Output() searchStringChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  handleSearch(){
    this.searchStringChanged.emit(this.searchString);
  }
}
