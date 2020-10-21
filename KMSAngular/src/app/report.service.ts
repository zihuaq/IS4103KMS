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

  getProfileReports(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/getProfileReports')
      .pipe(catchError(this.handleError));
  }

  passProfileReportVerdict(report: Report, active: Boolean): Observable<any> {
    let PassProfileReportVerdictReq = {
      report: report,
      active: active,
    };

    return this.http
      .post<any>(
        this.baseUrl + '/passProfileReportVerdict',
        PassProfileReportVerdictReq
      )
      .pipe(catchError(this.handleError));
  }

  getProjectReports(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/getProjectReports')
      .pipe(catchError(this.handleError));
  }

  passProjectReportVerdict(report: Report, active: Boolean):Observable<any>{
    let PassProjectReportVerdictReq ={
      report: report,
      active: active
    }

    return this.http.post<any>(this.baseUrl+'/passProjectReportVerdict', PassProjectReportVerdictReq)
    .pipe(catchError(this.handleError))
  }

  getGroupReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getGroupReports')
    .pipe(catchError(this.handleError))
  }

  passGroupReportVerdict(report: Report, active: Boolean):Observable<any>{
    let PassGroupReportVerdictReq ={
      report: report,
      active: active
    }

    return this.http.post<any>(this.baseUrl+'/passGroupReportVerdict', PassGroupReportVerdictReq)
    .pipe(catchError(this.handleError))
  }

  getPostReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getPostReports')
    .pipe(catchError(this.handleError))
  }

  passPostReportVerdict(report: Report, active: Boolean):Observable<any>{
    let PassPostReportVerdictReq ={
      report: report,
      active: active
    }

    return this.http.post<any>(this.baseUrl+'/passPostReportVerdict', PassPostReportVerdictReq)
    .pipe(catchError(this.handleError))
  }

  getCommentReports():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/getCommentReports')
    .pipe(catchError(this.handleError))
  }

  passCommentReportVerdict(report: Report, active: Boolean):Observable<any>{
    let PassCommentReportVerdictReq ={
      report: report,
      active: active
    }

    return this.http.post<any>(this.baseUrl+'/passCommentReportVerdict', PassCommentReportVerdictReq)
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
