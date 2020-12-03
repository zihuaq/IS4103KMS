import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { User } from './classes/user';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserType } from './classes/user-type.enum';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    baseUrl: string = '/api/leaderboard';

    constructor(private http: HttpClient) { }

    getReputationPointLeaderboard(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/reputationPointLeaderboard')
            .pipe(catchError(this.handleError));
    }

    getWeeklyDonationAmountLeaderboard(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/weeklyDonationAmountLeaderboard')
            .pipe(catchError(this.handleError));
    }

    getProjectLeaderboard(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/projectLeaderboard')
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage: string = '';

        if (error.error instanceof ErrorEvent) {
            errorMessage = 'An unknown error has occurred: ' + error.error.message;
        } else {
            errorMessage = error.error.error;
        }

        console.error(errorMessage);

        return throwError(errorMessage);
    }
}
