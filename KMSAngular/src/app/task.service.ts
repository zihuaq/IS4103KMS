import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
