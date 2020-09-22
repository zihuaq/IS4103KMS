import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { Project } from 'src/app/classes/project';
import { ProjectService } from '../../project.service';
import { User } from '../../classes/user';

declare var $: any;

@Component({
  selector: 'app-members-tab',
  templateUrl: './members-tab.component.html',
  styleUrls: ['./members-tab.component.css']
})
export class MembersTabComponent implements OnInit {

  @Input() projectToEdit: Project;
  @Output() projectChanged = new EventEmitter<Project>();

  constructor() { }

  ngOnInit(): void {
  }

  isAdmin(user: User): boolean {
    for(let member of this.projectToEdit.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }
}
