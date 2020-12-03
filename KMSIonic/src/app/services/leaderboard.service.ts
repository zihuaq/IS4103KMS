import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilityService } from './utility.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + 'leaderboard';
  }

  getReputationPointLeaderboard(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/reputationPointLeaderboard')
      .pipe(catchError(this.handleError));
  }

  getReputationPointLeaderboardForFollowing(userId: number): Observable<any> {
    return this.http
      .get<any>(
        this.baseUrl + '/getReputationPointLeaderboardForFollowing/' + userId
      )
      .pipe(catchError(this.handleError));
  }

  getWeeklyDonationAmountLeaderboard(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/weeklyDonationAmountLeaderboard')
      .pipe(catchError(this.handleError));
  }

  getWeeklyDonationAmountLeaderboardForFollowing(
    userId: number
  ): Observable<any> {
    return this.http
      .get<any>(
        this.baseUrl +
          '/getWeeklyDonationAmountLeaderboardForFollowing/' +
          userId
      )
      .pipe(catchError(this.handleError));
  }

  getProjectLeaderboard(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/projectLeaderboard')
      .pipe(catchError(this.handleError));
  }

  getProjectLeaderboardForFollowing(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/getProjectLeaderboardForFollowing/' + userId)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
      errorMessage = error.error.error;
    }
    return throwError(errorMessage);
  }
}
