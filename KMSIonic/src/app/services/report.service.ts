import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Report } from '../classes/report';
import { catchError } from 'rxjs/operators';
import { UtilityService } from './utility.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + 'report';
  }

  reportProfile(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportProfile', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  reportProject(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportProject', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  reportGroup(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportGroup', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  reportPost(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportPost', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  reportComment(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportComment', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  reportProject(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportProject', report, httpOptions)
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
