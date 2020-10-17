import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Task } from '../../../classes/task';
import { Link } from '../../../classes/link';
import { LinkService } from '../../../link.service';
import { TaskService } from '../../../task.service';
import { gantt } from 'dhtmlx-gantt';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

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

  constructor(private taskService: TaskService,
    private linkService: LinkService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    
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
    
    gantt.attachEvent("onAfterTaskAdd", (id, task) => {
      this.taskService.createNewTask(task, this.projectId).subscribe(
        response => {
          console.log(task, response);
          gantt.changeTaskId(id, response);
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Task is successfully created!',
          });
        });
    }, null);

    gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
      this.taskService.updateTask(task).subscribe(
        response => {
          console.log(task);
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Task is successfully updated!',
          });
        });
    }, null);

    gantt.attachEvent("onAfterTaskDelete", (id) => {
      this.taskService.deleteTask(id).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Task is successfully deleted!',
          });
        });
    }, null);

    gantt.attachEvent("onAfterLinkAdd", (id, link) => {
      this.linkService.createNewLink(link).subscribe(
        response => {
          console.log(link, response);
          gantt.changeLinkId(id, response);
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Link is successfully created!',
          });
        });
    }, null);

    gantt.attachEvent("onAfterLinkDelete", (id) => {
      this.linkService.deleteLink(id).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Link is successfully deleted!',
          });
        });
    }, null);

    gantt.attachEvent("onBeforeTaskDisplay", (id) => {
      if (this.hasSubstr(id)) {
        return true;
      } else {
        return false;
      }
    }, null);

    gantt.config.lightbox.sections = [
        {name:"description", height:50, map_to:"text", type:"textarea", focus:true},
        {name:"period", height:50, map_to:"auto", type:"time", time_format:["%d","%m","%Y","%H:%i"]}
    ];
    gantt.locale.labels["section_description"] = "Task Name";
    gantt.locale.labels["section_period"] = "Time Period";
    gantt.config.time_picker = "%g:%i %A";

    gantt.plugins({
      quick_info: true,
    });

    gantt.templates.quick_info_date = function(start, end, task){
      return null;
    };

    gantt.templates.quick_info_title = function(start, end, task){
      return "<b>" + task.text + "<b>";
    };

    gantt.templates.quick_info_content = function(start, end, task){ 
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

    gantt.templates.task_class = () => {return "task_color"};

    var hourToStr = gantt.date.date_to_str("%h:%i %A");
    var hourRangeFormat = (step) => {
      return (date) => {
        var intervalEnd = new Date(gantt.date.add(date, step, "hour").valueOf() - 1)
        return hourToStr(date) + " - " + hourToStr(intervalEnd);
      };
    };

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
          min_column_width:125,
          scales:[
            { unit: "day", step: 1, format: "%d %F"},
            { unit: "hour", step: 12, format: hourRangeFormat(12)}
          ]
        },
        {
          name:"day1",
          min_column_width:80,
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
      }},
      {name:"add", label:""},
    ];
  }
  
  ngAfterViewInit() {
    gantt.init(this.ganttChart.nativeElement);
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
  
}
