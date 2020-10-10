import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from 'src/app/classes/activity';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  baseUrl: string = '/api/activity';

  constructor(private httpClient: HttpClient) { }

  getActivitiesByProject(projectId: number, dateString: string): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/getActivitiesByProject/" + projectId + "/" + dateString).pipe();
  }

  createNewActivity(newActivity: Activity, projectId): Observable<any> {
    let createActivityReq = {
      "newActivity" : newActivity,
      "projectId" : projectId
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewActivity", createActivityReq, httpOptions).pipe(
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
