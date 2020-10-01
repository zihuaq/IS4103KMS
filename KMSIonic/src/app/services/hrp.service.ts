import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilityService } from "./utility.service"

import { HumanResourcePosting } from '../classes/human-resource-posting';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
}

@Injectable({
  providedIn: 'root'
})
export class HrpService {

  baseUrl: string

  constructor(
    private httpClient: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + "tag"
  }

  getHrpByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/getHrpByProject/" + projectId).pipe();
  }

  getHrp(hrpId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/"+hrpId).pipe(
      catchError(this.handleError)
    );
  }

  createNewHrp(newHrp: HumanResourcePosting, projectId: number, tagIds: number[]): Observable<any> {
    let createHrpReq = {
      "newHrp" : newHrp,
      "projectId": projectId,
      "tagIds": tagIds
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewHrp", createHrpReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateHrp(hrpToUpdate: HumanResourcePosting):Observable<any> {
    return this.httpClient.post<any>(this.baseUrl+"/updateHrp", hrpToUpdate, httpOptions).pipe();
  }

  deleteHrp(hrpId: number):Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl+"/deleteHrp/"+hrpId).pipe(
      catchError(this.handleError)
    );
  }

  joinHrp(hrpId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/joinHrp/" + hrpId + "/" + userId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  leaveHrp(hrpId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/leaveHrp/" + hrpId + "/" + userId, null, httpOptions).pipe(
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
