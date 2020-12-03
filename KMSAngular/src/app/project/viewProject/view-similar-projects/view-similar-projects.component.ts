import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { MatchingService } from 'src/app/matching.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from 'src/app/tag.service';
import { Project } from 'src/app/classes/project';
import { Tag } from 'src/app/classes/tag';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { ProjectMatchesRsp } from 'src/app/models/ProjectMatchesRsp';

declare var $: any;

@Component({
  selector: 'app-view-similar-projects',
  templateUrl: './view-similar-projects.component.html',
  styleUrls: ['./view-similar-projects.component.css']
})
export class ViewSimilarProjectsComponent implements OnInit {

  projectRecommendations: ProjectMatchesRsp[];
  filteredProjectReco: ProjectMatchesRsp[];
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
        this.filteredProjectReco = this.projectRecommendations;
        console.log("matches:" + this.filteredProjectReco);
      }
    );
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

  onSelect(project: Project): void {
    this.router.navigate(["/projectDetails/" + project.projectId + "/basic-details"]);
  }
}
