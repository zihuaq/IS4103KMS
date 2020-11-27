import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Award } from './classes/award';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  baseUrl: string = '/api/Award';

  constructor(private httpClient: HttpClient) { }


  getAwards(projectId: number): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl+"/" + projectId).pipe(
      catchError(this.handleError)
    );
  }

  createNewAward(award: Award, projectId: number): Observable<any> {
    let createAwardReq = {
      "award" : award,
      "projectId" : projectId
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewAward", createAwardReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateAward(award: Award): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl+"/updateAward", award, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteAward(awardId: number):Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl+"/deleteAward/" + awardId).pipe(
      catchError(this.handleError)
    );
  }

  issueAward(awardId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/issueAward/" + awardId + "/" + userId, null, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  withdrawAward(awardId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/withdrawAward/" + awardId + "/" + userId, null, httpOptions).pipe(
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
