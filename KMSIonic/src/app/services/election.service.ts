import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Election } from '../classes/election';
import { ElectionApplication } from '../classes/election-application';
import { UtilityService } from './utility.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + 'election';
  }

  getHasActiveElection(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/hasActiveElection')
      .pipe(catchError(this.handleError));
  }

  getActiveElection(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/activeElection')
      .pipe(map(this.parseElectionDate), catchError(this.handleError));
  }

  createElection(election: Election) {
    return this.http
      .post<any>(this.baseUrl + '/createElection', election, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateElection(election: Election) {
    return this.http
      .put<any>(this.baseUrl + '/updateElection', election, httpOptions)
      .pipe(catchError(this.handleError));
  }

  endElection(election: Election) {
    return this.http
      .put<any>(this.baseUrl + '/endElection', election, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getElectionApplicationsForElection(electionId: number) {
    return this.http
      .get<any>(this.baseUrl + '/getElectionApplication/' + electionId)
      .pipe(catchError(this.handleError));
  }

  createElectionApplication(electionApplication: ElectionApplication) {
    return this.http
      .post<any>(
        this.baseUrl + '/createElectionApplication',
        electionApplication,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  rejectElectionApplication(electionApplicationId: number) {
    return this.http
      .delete<any>(
        this.baseUrl + '/rejectElectionApplication/' + electionApplicationId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  endorseElectionApplication(
    electionApplicationId: number,
    endorserId: number
  ) {
    return this.http
      .post<any>(
        this.baseUrl +
          '/endorseElectionApplication/' +
          electionApplicationId +
          '/' +
          endorserId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private parseElectionDate(election: any) {
    return {
      ...election,
      startDate: new Date(
        Date.UTC(
          election.startDate.substring(0, 4),
          election.startDate.substring(5, 7) - 1,
          election.startDate.substring(8, 10),
          election.startDate.substring(11, 13),
          election.startDate.substring(14, 16),
          election.startDate.substring(17, 19)
        )
      )
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.error.error}`;
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
