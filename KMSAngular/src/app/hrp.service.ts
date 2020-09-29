import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HumanResourcePosting } from './classes/human-resource-posting';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HrpService {

  baseUrl: string = '/api/hrp';

  constructor(private httpClient: HttpClient) { }

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
