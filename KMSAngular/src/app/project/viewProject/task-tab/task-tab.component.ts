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

  constructor(private taskService: TaskService,
    private linkService: LinkService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    // const dp = gantt.createDataProcessor({
		// 	task: {
    //     create: (data: Task) => this.taskService.createNewTask(data, this.projectId).subscribe(response => {return response}),
    //     update: (data: Task) => this.taskService.updateTask(data),
		// 		delete: (id: number) => this.taskService.deleteTask(id)
		// 	},
		// 	link: {
    //     create: (data: Link) => this.linkService.createNewLink(data),
		// 		delete: (id: number) => this.linkService.deleteLink(id)
		// 	}
    // });
    
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
    
  }
  
  ngAfterViewInit() {
    gantt.config.fit_tasks = true;
    gantt.config.date_grid = "%d-%m-%Y";
    gantt.config.date_format = '%Y-%m-%d %H:%i';
    gantt.init(this.ganttChart.nativeElement);
	}
}
