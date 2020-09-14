import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../classes/user';
import { TagService } from '../../tag.service';
import { Tag } from '../../classes/tag';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.css']
})
export class MaterialResourceAvailableComponent implements OnInit {

  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  mraTags: Tag[];

  constructor(private tagService: TagService) { }

  ngOnInit(): void {
    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.mraTags = response;
      });
  }

  createMaterialResourceRequest(mraForm: NgForm) {
  }
}
