import { Component, EventEmitter, Input, NgModule, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-view-all-project',
  templateUrl: './view-all-project.component.html',
  styleUrls: ['./view-all-project.component.css']
})
export class ViewAllProjectComponent implements OnInit {

  @Input() searchModel;

  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();

  projects: Project[];

  constructor(public projectService: ProjectService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAccessRight();
    
    this.projectService.getAllProject().subscribe(
      response => {
        this.projects = response.projects;
      }
    );
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

  onSelect(project: Project): void {
    this.router.navigate(["/projectDetails/" + project.projectId]);
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}

