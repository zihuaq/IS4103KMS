import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class MatchingService {
    baseUrl: string = '/api/matching';

    constructor(private http: HttpClient) { }

    getMatchesForMrp(mrpId: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/getMatchesForMrp/' + mrpId)
            .pipe(
                map((data) => {
                    return data.map((mra) => {
                        if (mra.startDate && mra.endDate) {
                            return {
                                ...mra,
                                startDate: new Date(
                                    Date.UTC(
                                        mra.startDate.substring(0, 4),
                                        mra.startDate.substring(5, 7) - 1,
                                        mra.startDate.substring(8, 10),
                                        mra.startDate.substring(11, 13),
                                        mra.startDate.substring(14, 16),
                                        mra.startDate.substring(17, 19)
                                    )
                                ),
                                endDate: new Date(
                                    Date.UTC(
                                        mra.endDate.substring(0, 4),
                                        mra.endDate.substring(5, 7) - 1,
                                        mra.endDate.substring(8, 10),
                                        mra.endDate.substring(11, 13),
                                        mra.endDate.substring(14, 16),
                                        mra.endDate.substring(17, 19)
                                    )
                                ),
                            };
                        } else {
                            return mra;
                        }
                    });
                }),
                catchError(this.handleError)
            );
    }

    getMatchesForHrp(hrpId: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/getMatchesForHrp/' + hrpId)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage: string = '';

        if (error.error instanceof ErrorEvent) {
            errorMessage = 'An unknown error has occurred: ' + error.error.message;
        } else {
            errorMessage =
                'A HTTP error has occurred: ' +
                `HTTP ${error.status}: ${error.error.error}`;
        }

        console.error(errorMessage);

        return throwError(errorMessage);
    }
}