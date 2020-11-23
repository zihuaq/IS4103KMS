import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from 'src/app/classes/activity';
import { review } from './classes/review';

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

  getActivityById(activityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+ "/getActivityById/" + activityId).pipe(
      catchError(this.handleError)
    );
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

  updateActivity(activityToUpdate: Activity): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl+"/updateActivity", activityToUpdate, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteActivity(activityId: number):Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl+"/deleteActivity/" + activityId).pipe(
      catchError(this.handleError)
    );
  }

  addMemberToActivity(activityId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/addMemberToActivity/" + activityId + "/" + userId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  removeMemberFromActivity(activityId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeMemberFromActivity/" + activityId + "/" + userId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addHrpToActivity(activityId: number, hrpId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/addHrpToActivity/" + activityId + "/" + hrpId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  removeHrpFromActivity(activityId: number, hrpId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeHrpFromActivity/" + activityId + "/" + hrpId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAllocatedResources(activityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/getAllocatedResources/" + activityId).pipe(
      catchError(this.handleError)
    );
  }

  allocateResource(activityId: number, mrpId: number, quantity: number) {
    return this.httpClient.post<any>(this.baseUrl+"/allocateResource/" + activityId + "/" + mrpId + "/" + quantity, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateAllocateQuantity(activityId: number, mrpId: number, newQuantity: number) {
    return this.httpClient.post<any>(this.baseUrl+"/updateAllocateQuantity/" + activityId + "/" + mrpId + "/" + newQuantity, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  removeAllocation(activityId: number, mrpId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeAllocation/" + activityId + "/" + mrpId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProjectReviewForActivity(activityId: number, userId: number){
    return this.httpClient.get<any>(this.baseUrl+"/getProjectReviewForActivity/" + activityId + "/" + userId).pipe(
      catchError(this.handleError)
    );
  }

  getUserReviewsForActivity(activityId: number, userId: number){
    return this.httpClient.get<any>(this.baseUrl+"/getUserReviewsForActivity/" + activityId + "/" + userId).pipe(
      catchError(this.handleError)
    );
  }

  createNewUserReview(review: review, from: number, to: number, madeFromActivityId: number): Observable<any> {
    let CreateUserReviewReq = {
      "review" : review,
      "from" : from,
      "to" : to,
      "madeFromActivityId" : madeFromActivityId,
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewUserReview", CreateUserReviewReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createNewProjectReview(review: review, from: number, project: number, madeFromActivityId: number): Observable<any> {
    let CreateProjectReviewReq = {
      "review" : review,
      "from" : from,
      "project" : project,
      "madeFromActivityId" : madeFromActivityId,
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewProjectReview", CreateProjectReviewReq, httpOptions).pipe(
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
