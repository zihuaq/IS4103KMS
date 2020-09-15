import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from '../../classes/user';
import { TagService } from '../../tag.service';
import { Tag } from '../../classes/tag';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';

declare var $: any;

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.css']
})
export class MaterialResourceAvailableComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  mraTags: Tag[];
  newMra: MaterialResourceAvailable;
  minDate = new Date().toISOString().slice(0,10);
  minEndDate = new Date().toISOString().slice(0,10);
  lat = 51.678418;
  lng = 7.809007;

  constructor(private tagService: TagService, private userService: UserService) { }

  ngOnInit(): void {
    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.mraTags = response;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.mraTags = response;
      });
    this.user = changes.user.currentValue;
  }

  createMaterialResourceRequest(mraForm: NgForm) {
    if(mraForm.valid) {
      this.newMra = new MaterialResourceAvailable();
      this.newMra.mraOwner = this.user;
      this.newMra.name = mraForm.value.mraName;
      this.newMra.quantity = mraForm.value.quantity;
      this.newMra.description = mraForm.value.description;
      this.newMra.country = mraForm.value.country;
      this.newMra.startDate = new Date(mraForm.value.startDate);
      this.newMra.endDate = new Date(mraForm.value.endDate);
      this.userService.createMaterialResourceAvailable(this.user.userId, this.newMra).subscribe(responsedata => {
        this.user.mras = responsedata;
      });
      
      $("#addMraModalCloseBtn").click();
      this.userChanged.emit(this.user);
    }
  }

  deleteMra(mraId: number){
    this.userService.deleteMaterialResourceAvailable(this.user.userId, mraId).subscribe(responsedata => {
      this.user.mras = responsedata;
    });
    this.userChanged.emit(this.user);
  }
}
