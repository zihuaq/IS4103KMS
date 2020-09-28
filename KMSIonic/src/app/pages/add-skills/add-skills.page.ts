import { Component, OnInit } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.page.html',
  styleUrls: ['./add-skills.page.scss'],
})
export class AddSkillsPage implements OnInit {
  skillTags: Tag[];
  filteredTags: Tag[];
  chosenTags: Tag[] = [];
  searchValue: string;
  hasSelected: boolean;

  constructor(private tagService: TagService, private userService: UserService) { }

  ngOnInit() {
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.skillTags = response;
    });
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value;

    if (!this.searchValue) {
      this.filteredTags = this.skillTags;
    }

    this.filteredTags = this.skillTags.filter(tag => {
      if (tag.name && this.searchValue) {
        return (tag.name.toLowerCase().includes(this.searchValue.toLowerCase()));
      }
    });
  }

  selectTag(tag: Tag){
    this.hasSelected = false;
    this.chosenTags.forEach((element) => {
      if(element.name == tag.name){
        this.hasSelected = true;
      }
    });
    if(!this.hasSelected){
      this.chosenTags.push(tag);
      this.clearSearch();
    }
  }

  removeTag(tag: Tag){
    this.chosenTags.forEach((element, index) => {
      if(element.name == tag.name){
        this.chosenTags.splice(index,1)
      }
    });
  }

  clearSearch(){
    this.searchValue = "";
    this.filteredTags = [];
  }

  save(){
    // this.userService
    // .addSkillsToProfile(this.profile.userId, this.selectedTags)
    // .subscribe((responsedata) => {
    //   this.profile.skills = responsedata;
    // });
  }
}
