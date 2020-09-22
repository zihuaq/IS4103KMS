import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Project } from 'src/app/classes/project';
import { ProjectService } from '../../project.service';
import { Tag } from '../../classes/tag';
import { TagService } from '../../tag.service';

declare var $: any;

@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.css']
})
export class DetailsTabComponent implements OnInit, OnChanges {

  @Input() projectToEdit: Project;
  @Output() projectChanged = new EventEmitter<Project>();
  tags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  infoMessage: string;
  errorMessage: string;

  constructor(public projectService: ProjectService,
    private tagService: TagService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
        $('#sdgselect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
      }
    );
    this.projectToEdit = changes.projectToEdit.currentValue;
  }

  edit(editProjectForm: NgForm) {
    this.selectedTags = [];
    this.selectedTagNames = $('#sdgselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit Sdg tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Sgf tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    if (editProjectForm.valid) {
      this.projectToEdit.sdgs = this.selectedTags;
      this.projectService.updateProject(this.projectToEdit).subscribe(
        response => {
          this.infoMessage = "project updated successfully";
          this.errorMessage = null;
        },
        error => {
          this.infoMessage = null;
          this.errorMessage = "Error has occurred while updating the project";
        }
      );
    }
  }

}
