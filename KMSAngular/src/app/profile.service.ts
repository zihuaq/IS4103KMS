import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl: string = '/api/profile';

  constructor(private http: HttpClient) {}

  getAllProfiles(): Observable<any> {
    return this.http.get<any>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getProfile(id: String): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/' + id)
      .pipe(catchError(this.handleError));
  }

  makeProfileClaim(userId: String, profileId: String): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/claim/' + userId + '/' + profileId, null)
      .pipe(catchError(this.handleError));
  }

  getAllProfileClaims(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/claims')
      .pipe(catchError(this.handleError));
  }

  settleProfileClaim(
    claimProfileRequestId: String,
    accept: boolean
  ): Observable<any> {
    return this.http
      .post<any>(
        this.baseUrl + '/settleClaim/' + claimProfileRequestId + '/' + accept,
        null
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
      errorMessage = error.error.message;
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
