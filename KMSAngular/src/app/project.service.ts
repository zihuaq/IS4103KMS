import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SessionService } from './session.service';
import { Project } from './classes/project';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string = '/api/project';

  constructor(private sessionService: SessionService, private httpClient: HttpClient) { }

  getAllProject(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"getAllProject").pipe();
  }

  createNewProject(newProject: Project, ownerId: number): Observable<any> {
    let createProjectReq = {
      "newProject": Project,
      "ownerId": ownerId
    }

    return this.httpClient.put<any>(this.baseUrl+"createNewProject", createProjectReq, httpOptions).pipe(
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
