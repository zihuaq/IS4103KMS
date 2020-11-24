import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { MatchingService } from 'src/app/matching.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from 'src/app/tag.service';
import { Project } from 'src/app/classes/project';
import { Tag } from 'src/app/classes/tag';
import { ProjectType } from 'src/app/classes/project-type.enum';

declare var $: any;

@Component({
  selector: 'app-view-similar-projects',
  templateUrl: './view-similar-projects.component.html',
  styleUrls: ['./view-similar-projects.component.css']
})
export class ViewSimilarProjectsComponent implements OnInit {

  projectRecommendations: Project[];
  filteredProjects: Project[];
  allTags: Tag[];
  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();
  ProjectType = ProjectType;

  constructor(public matchingService: MatchingService,
    private activatedRouter: ActivatedRoute,
    public tagService: TagService,
    private router: Router) {
  }

  ngOnInit(): void {
    var projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));
    this.matchingService.getMatchesForProjects(projectId).subscribe(
      response => {
        this.projectRecommendations = response;
        this.projectRecommendations.splice(10);
        this.filteredProjects = this.projectRecommendations;
      }
    );
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.allTags = response;
        $('#similarprojects-sdg-select2').select2({
          data: this.allTags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
        $('#similarprojects-sdg-select2').on("change", () => {
          this.sdgFilter()
        });
      }
    );
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllSDGTags().subscribe((response) => {
      this.allTags = response;
      $('#similarprojects-sdg-select2').select2({
        data: this.allTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

  sdgFilter() {
    let selectedTagNames = $('#similarprojects-sdg-select2').val();
    if (selectedTagNames.length > 0) {
      this.filteredProjects = [];
      let selectedTag: Tag[] = [];
      this.allTags.forEach((element) => {
        if (selectedTagNames.includes(element.name)) {
          selectedTag.push(element);
        }
      });
      for (let tag of selectedTag) {
        for (let project of this.projectRecommendations) {
          for (let sdg of project.sdgs) {
            if (sdg.name === tag.name && !this.containProject(project)) {
              this.filteredProjects.push(project);
            }
          }
        }
      }
    } else {
      this.filteredProjects = this.projectRecommendations;
    }
  }

  containProject(project: Project) {
    for (let proj of this.filteredProjects) {
      if (project.projectId == proj.projectId) {
        return true;
      }
    }
    false;
  }

  onSelect(project: Project): void {
    this.router.navigate(["/projectDetails/" + project.projectId + "/basic-details"]);
  }
}
