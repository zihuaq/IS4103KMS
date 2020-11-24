import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Task } from '../../../classes/task';
import { Link } from '../../../classes/link';
import { LinkService } from '../../../link.service';
import { TaskService } from '../../../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import * as moment from 'moment';
import { gantt } from 'dhtmlx-gantt';
import "./../../../../assets/gantt-chart-api";
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-task-tab',
  templateUrl: './task-tab.component.html',
  styleUrls: ['./task-tab.component.css']
})
export class TaskTabComponent implements OnInit {
  @ViewChild('ganttChart') ganttChart: ElementRef;
  
  tasks: Task[];
  links: Link[];
  projectId: number;
  searchInput: string = "";
  events: string[];
  isMember: boolean = false;

  constructor(private taskService: TaskService,
    private linkService: LinkService,
    private projectService: ProjectService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute) {
    this.events = [];
  }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        for (let member of response.projectMembers) {
          if (this.sessionService.getCurrentUser().userId == member.userId) {
            this.isMember = true;
          }
        }
      }
    );

    //for search tasks
    this.events.push(
      gantt.attachEvent("onBeforeTaskDisplay", (id) => {
        if (this.hasSubstr(id)) {
          return true;
        } else {
          return false;
        }
      }, null)
    );

    //quick info configuration
    gantt.plugins({
      quick_info: true,
    });

    gantt.templates.quick_info_date = (start, end, task) => {
      return null;
    };

    gantt.templates.quick_info_title = (start, end, task) => {
      return "<b>" + task.text + "<b>";
    };

    gantt.templates.quick_info_content = (start, end, task) => { 
      var durationStr: string
        if (task.duration > 1) {
          durationStr = task.duration + " days"
        } else {
          durationStr = task.duration + " day"
        } 

      return "<b>Start:</b> " + moment(task.start_date).format("dddd D MMMM YYYY h:mm A") +
      "<br/><b>End:</b> " + moment(task.end_date).format("dddd D MMMM YYYY h:mm A") +
      "<br/><b>Duration:</b> " + durationStr +
      "<br/><b>Progress:</b> " + Math.round(task.progress * 100) + "%";
    };
    gantt.config.quickinfo_buttons = [];

    //scaling - zooming in/out
    var zoomConfig = {
      maxColumnWidth: 72,
      minColumnWidth: 32,
      levels: [
        {
          name:"hour1",
          min_column_width:72,
          scales:[
            {unit: "day", step: 1, format: "%d %F"},
            {unit: "hour", step: 1, format: "%h:%i %A"}
          ]
        },
        {
          name:"hour2",
          min_column_width:28,
          scales:[
            { unit: "day", step: 1, format: "%d %F"},
            { unit: "hour", step: 1, format: "%G"}
          ]
        },
        {
          name:"day1",
          min_column_width:90,
          scales:[
            {unit: "month", step: 1, format: "%F %Y"},
            {unit: "day", step: 1, format: "%d %M"}
          ]
        },
        {
          name:"day2",
          min_column_width:38,
          scales:[
          {unit: "month", step: 1, format: "%F %Y"},
          {unit: "day", step: 1, format: "%d"}
          ]
      },
        {
          name:"month1",
          min_column_width:80,
          scales:[
            {unit: "year", step: 1, format: "%Y"},
            {unit: "month", step: 1, format: "%F"}
          ]
        },
        {
          name:"month2",
          min_column_width:45,
          scales:[
            {unit: "year", step: 1, format: "%Y"},
            {unit: "month", step: 1, format: "%M"}
          ]
        }
      ]
    };    
    gantt.config.scale_height = 60;
    gantt.ext.zoom.init(zoomConfig);
    gantt.ext.zoom.setLevel("day1");

    gantt.templates.task_class = () => {return "task_color"};
    gantt.config.round_dnd_dates = false;
    gantt.config.fit_tasks = true;
    gantt.config.sort = true;
    gantt.config.open_tree_initially = true;
    gantt.config.date_grid = "%d-%m-%Y";
    gantt.config.date_format = '%Y-%m-%d %H:%i';
    gantt.config.columns=[
      {name:"text", label:"Task Name", tree:true, width:170 },
      {name:"start_date", label:"Start Date", align: "center", width: 130, template: (task) => {
        return moment(task.start_date).format("DD/MM/YY h:mm A")
      }},
      {name:"end_date", label:"End Date", align: "center", width: 130, template: (task) => {
        return moment(task.end_date).format("DD/MM/YY h:mm A")
      }}
    ];
    gantt.clearAll();
    gantt.config.readonly = true;
  }
  
  ngAfterViewInit() {
    gantt.init(this.ganttChart.nativeElement);
    forkJoin([this.taskService.getTasksByProject(this.projectId), this.linkService.getLinksByProject(this.projectId)]).subscribe(
			response => {
				this.tasks = response[0];
				this.links = response[1];
        console.log({tasks: this.tasks, links: this.links});
        // var start = this.tasks[0].start_date.toString().substring(0, 20);
        // var end = this.tasks[0].end_date.toString().substring(0, 20);
        // console.log(start, new Date(start), moment(this.tasks[0].start_date.toString().substring(0, 20)).format("YYYY-MM-DD HH:mm"));
				gantt.parse({tasks: this.tasks, links: this.links});
			}
    )
  }

  ngOnDestroy(){
    while (this.events.length) {
      gantt.detachEvent(this.events.pop());
    }
  }
  
  onChange() {
    gantt.refreshData();
  }

  hasSubstr(parentId: number) {
    var task = gantt.getTask(parentId);
    if(task.text.toLowerCase().indexOf(this.searchInput.toLowerCase() ) !== -1)
      return true;
  
    var child = gantt.getChildren(parentId);
    for (var i = 0; i < child.length; i++) {
      if (this.hasSubstr(child[i]))
        return true;
    }
    return false;
  }

  export(type: string) {
    switch(type) {
      case "pdf":
        gantt.exportToPDF({
          header:'<style>.task_color {border: 2px solid #7094e2; color: #7094e2; background: #7094e2;}' 
          + '.task_color .gantt_task_progress {background: #5177ca;}'
          + '.gantt_task_link .gantt_line_wrapper div {background-color: #5034b8;}'
          + '.gantt_task_link .gantt_link_arrow {border-left-color: #5034b8; border-right-color: #5034b8; border-bottom-color: #5034b8; border-top-color: #5034b8;}</style>'
        });
        break;
      case "png":
        gantt.exportToPNG({
          header:'<style>.task_color {border: 2px solid #7094e2; color: #7094e2; background: #7094e2;}' 
          + '.task_color .gantt_task_progress {background: #5177ca;}'
          + '.gantt_task_link .gantt_line_wrapper div {background-color: #5034b8;}'
          + '.gantt_task_link .gantt_link_arrow {border-left-color: #5034b8; border-right-color: #5034b8; border-bottom-color: #5034b8; border-top-color: #5034b8;}</style>'
        });
        break;
      case "excel":
        gantt.exportToExcel({});
        break;
      case "ical":
        gantt.exportToICal({});
        break;
      case "msproject":
        gantt.exportToMSProject({});
        break;
    }
  }
  
}
