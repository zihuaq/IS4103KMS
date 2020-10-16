import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from './classes/task';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl: string = '/api/task';

  constructor(private httpClient: HttpClient) { }

  getTasksByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getTasksByProject/" + projectId).pipe(
      map((data) => {
        return data.map((task: Task) => {
          return {...task,
            start_date: moment(task.start_date.toString().substring(0, 20)).format("YYYY-MM-DD HH:mm"),
            end_date: moment(task.end_date.toString().substring(0, 20)).format("YYYY-MM-DD HH:mm")
          }
        });
      }),
      catchError(this.handleError)
    );
  }

  getTask(taskId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/" + taskId).pipe(
      catchError(this.handleError)
    );
  }

  createNewTask(newTask: Task, projectId: number): Observable<any> {
    let createTaskReq = {
      "newTask": newTask,
      "projectId": projectId
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewTask", createTaskReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(taskToUpdate: Task) {
    return this.httpClient.post<any>(this.baseUrl + "/updateTask", taskToUpdate, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(taskId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteTask/" + taskId).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    
    if (error.error instanceof ErrorEvent) {
        errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
        errorMessage = 'An HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error.message}`;
    }
    return throwError(errorMessage)
  }
}
