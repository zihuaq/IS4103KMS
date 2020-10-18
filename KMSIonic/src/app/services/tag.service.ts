import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
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
export class TagService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + 'tag';
  }

  getAllSkillTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/skill')
      .pipe(catchError(this.handleError));
  }

  getAllMaterialResourceTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/materialresource')
      .pipe(catchError(this.handleError));
  }

  getAllSDGTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/sdg')
      .pipe(catchError(this.handleError));
  }

  getAllProfileReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report/profile')
      .pipe(catchError(this.handleError));
  }

  getAllGroupReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report/group')
      .pipe(catchError(this.handleError));
  }

  getAllProjectReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report/project')
      .pipe(catchError(this.handleError));
  }

  getAllPostReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report/post')
      .pipe(catchError(this.handleError));
  }

  getAllCommentReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report/comment')
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
