import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Report } from './classes/report';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  baseUrl: string = '/api/report';

  constructor(private http: HttpClient) {}

  createReport(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/create', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  reportProject(report: Report): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/reportProject', report, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getProfileReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getProfileReports')
    .pipe(catchError(this.handleError))
  }

  passProfileReportVerdict(report: Report, active: Boolean):Observable<any>{
    let PassProfileReportVerdictReq ={
      report: report,
      active: active
    }

    return this.http.post<any>(this.baseUrl+'/passProfileReportVerdict', PassProfileReportVerdictReq)
    .pipe(catchError(this.handleError))
  }

  getProjectReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getProjectReports')
    .pipe(catchError(this.handleError))
  }

  getGroupReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getGroupReports')
    .pipe(catchError(this.handleError))
  }

  getPostReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getPostReports')
    .pipe(catchError(this.handleError))
  }

  getCommentReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getCommentReports')
    .pipe(catchError(this.handleError))
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
