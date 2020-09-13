import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../classes/user';
import { TagService } from '../../tag.service';
import { Tag } from '../../classes/tag';

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.css']
})
export class MaterialResourceAvailableComponent implements OnInit {

  @Input() user: User;
  mraTags: Tag[];

  constructor(private tagService: TagService) { }

  ngOnInit(): void {
    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.mraTags = response;
      });
  }

}
