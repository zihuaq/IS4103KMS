import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Task } from '../../../classes/task';
import { Link } from '../../../classes/link';
import { LinkService } from '../../../link.service';
import { TaskService } from '../../../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/notification.service';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';

import * as moment from 'moment';
import { gantt } from 'dhtmlx-gantt';
import "./../../../../assets/gantt-chart-api";

declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-task-tab',
  templateUrl: './edit-task-tab.component.html',
  styleUrls: ['./edit-task-tab.component.css']
})
export class EditTaskTabComponent implements OnInit {

  @ViewChild('ganttChart') ganttChart: ElementRef;
  
  tasks: Task[];
  links: Link[];
  projectId: number;
  searchInput: string = "";
  isReady: boolean = false;
  events: string[];
  project: Project;

  constructor(private taskService: TaskService,
    private linkService: LinkService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute) {
    this.events = [];
  }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }
    );

    //crud of tasks and links
    this.events.push(
      gantt.attachEvent("onAfterTaskAdd", (id, task) => {
        this.taskService.createNewTask(task, this.projectId).subscribe(
          response => {
            console.log(task, response);
            gantt.changeTaskId(id, response);
            let currentUser = this.sessionService.getCurrentUser();
            let newNotification = new Notification();
            newNotification.msg = "A new task has been added to " + this.project.name;
            newNotification.projectId = this.projectId;
            newNotification.groupId = null;
            newNotification.projectTab = "task-tab";
            for (let member of this.project.projectMembers) {
              if (member.userId != currentUser.userId) {
                this.notificationService.createNewNotification(newNotification, member.userId).subscribe();
              }
            }
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Task is successfully created!',
            });
          });
      }, null)
    );
    
    this.events.push(
      gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
        this.taskService.updateTask(task).subscribe(
          response => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Task is successfully updated!',
            });
          });
      }, null)
    );
    
    this.events.push(
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
      }, null)
    );
    
    this.events.push(
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
      }, null)
    );
    
    this.events.push(
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
      }, null)
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

    //for link validation
    this.events.push(
      gantt.attachEvent("onLinkCreated", (link) => {
        var check = this.checkLink(link, "link", null);
  
        if (check[0] == false) {
          $(document).Toasts('create', {
            class: 'bg-warning',
            title: 'Warning',
            autohide: true,
            delay: 6000,
            body: check[1],
          });
          return false;
        } else {
          return true;
        }
      }, null)
    );

    this.events.push(
      gantt.attachEvent("onBeforeTaskChanged", (id, mode, task) => {
        var sourceLinks = task.$source; 
        var targetLinks = task.$target;
        var isValid = true;
        var body;
  
        for (let linkId of sourceLinks) {
          const link = gantt.getLink(linkId);
          var check = this.checkLink(link, "sourceDrag", task);
          if (check[0] == false) {
            body = check[1];
            isValid = false;
            break;
          }
        }
  
        if (!isValid) {
          $(document).Toasts('create', {
            class: 'bg-warning',
            title: 'Warning',
            autohide: true,
            delay: 6000,
            body: body,
          });
          return false;
        } else {
          for (let linkId of targetLinks) {
            const link = gantt.getLink(linkId);
            var check = this.checkLink(link, "targetDrag", task);
            if (check[0] == false) {
              body = check[1];
              isValid = false;
              break;
            }
          }
          if (!isValid) {
            $(document).Toasts('create', {
              class: 'bg-warning',
              title: 'Warning',
              autohide: true,
              delay: 6000,
              body: body,
            });
            return false;
          } else {
            return true;
          }
        }
      }, null)
    );
   
    this.events.push(
      gantt.attachEvent("onLightboxSave", (id, task, is_new) => {
        //date validation
        var date = {day:null, month:null, year:null, hour:null};
        date.day = document.querySelectorAll<HTMLInputElement>("select[aria-label='Days']")[1].value;
        date.month = document.querySelectorAll<HTMLInputElement>("select[aria-label='Months']")[1].value;
        date.year = document.querySelectorAll<HTMLInputElement>("select[aria-label='Years']")[1].value;
        date.hour = document.querySelectorAll<HTMLInputElement>("select[aria-label='HoursMinutes']")[1].value;  

        var actual_end_date = new Date(date.year, date.month, date.day)
        actual_end_date.setHours(date.hour/60);
        // console.log(gantt.getLightboxValues().start_date)
        // console.log(actual_end_date)
        
        if (gantt.getLightboxValues().start_date > actual_end_date){
          $(document).Toasts('create', {
            class: 'bg-warning',
            title: 'Warning',
            autohide: true,
            delay: 6000,
            body: "Start date cannot be later than end date",
          });
          return false;
        }

        //link validation
        if (!is_new) {
          var sourceLinks = task.$source; 
          var targetLinks = task.$target;
          var isValid = true;
          var body;
  
          for (let linkId of sourceLinks) {
            const link = gantt.getLink(linkId);
            var check = this.checkLink(link, "sourceLightbox", task);
            if (check[0] == false) {
              body = check[1];
              isValid = false;
              break;
            }
          }
  
          if (!isValid) {
            $(document).Toasts('create', {
              class: 'bg-warning',
              title: 'Warning',
              autohide: true,
              delay: 6000,
              body: body,
            });
            return false;
          } else {
            for (let linkId of targetLinks) {
              const link = gantt.getLink(linkId);
              var check = this.checkLink(link, "targetLightbox", task);
              if (check[0] == false) {
                body = check[1];
                isValid = false;
                break;
              }
            }
            if (!isValid) {
              $(document).Toasts('create', {
                class: 'bg-warning',
                title: 'Warning',
                autohide: true,
                delay: 6000,
                body: body,
              });
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      }, null)
    );
    
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

    gantt.templates.task_class = () => {return "task_color"};

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
      }},
      {name:"add", label:""},
    ];
    gantt.clearAll();
    gantt.config.readonly = false;
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

  ngOnDestroy() {
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

  checkLink(link, type, task) {
    var source = gantt.getTask(link.source);
    var target = gantt.getTask(link.target);
    var isValid;
    var body;

    if (type == "sourceLightbox") {
      source = task;
    } else if (type == "targetLightbox") {
      target = task;
    }

    if (link.type == 0 && target.start_date < source.end_date) { //finish_to_start
      if (type == "link") {
        body = "Target task cannot start before source task ends";
      } else if (type == "sourceLightbox" || type == "sourceDrag") {
        body = "Selected task cannot end after " + target.text + " starts"
      } else if (type == "targetLightbox" || type == "targetDrag") {
        body = "Selected task cannot start before " + source.text + " ends"
      }
      isValid = false;
    } else if (link.type == 1 && target.start_date < source.start_date) { //start_to_start
      if (type == "link") {
        body = "Target task cannot start before source task starts";
      } else if (type == "sourceLightbox" || type == "sourceDrag") {
        body = "Selected task cannot start after " + target.text + " starts"
      } else if (type == "targetLightbox" || type == "targetDrag") {
        body = "Selected task cannot start before " + source.text + " starts"
      }
      isValid = false;
    } else if (link.type == 2 && target.end_date < source.end_date) { //finish_to_finish
      if (type == "link") {
        body = "Target task cannot end before source task ends";
      } else if (type == "sourceLightbox" || type == "sourceDrag") {
        body = "Selected task cannot end after " + target.text + " ends"
      } else if (type == "targetLightbox" || type == "targetDrag") {
        body = "Selected task cannot end before " + source.text + " ends"
      }
      isValid = false;
    } else if (link.type == 3 && target.end_date < source.start_date) { //start_to_finish
      if (type == "link") {
        body = "Target task cannot end before source task starts";
      } else if (type == "sourceLightbox" || type == "sourceDrag") {
        body = "Selected task cannot start after " + target.text + " ends"
      } else if (type == "targetLightbox" || type == "targetDrag") {
        body = "Selected task cannot end before " + source.text + " starts"
      }
      isValid = false;
    } else {
      isValid = true;
    }
    return [isValid, body];
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
