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
    return this.httpClient.get<any>(this.baseUrl+"/getAllProject").pipe();
  }

  createNewProject(newProject: Project, ownerId: number, tagIdsSelected: number[]): Observable<any> {
    let createProjectReq = {
      "newProject": newProject,
      "ownerId": ownerId,
      "tagIds": tagIdsSelected
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewProject", createProjectReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProjectById(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/" + projectId).pipe(
      catchError(this.handleError)
    );
  }

  joinProject(projectId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/joinProject/"+projectId+"/"+"/userId", null).pipe();
  }

  removeMember(projectId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeMember/"+projectId+"/"+"/userId", null).pipe();
  }

  addAdmin(projectId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/addAdmin/"+projectId+"/"+"/userId", null).pipe();
  }

  removeAdmin(projectId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeAdmin/"+projectId+"/"+"/userId", null).pipe();
  }

  changeOwner(projectId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/changeOwner/"+projectId+"/"+"/userId", null).pipe();
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
