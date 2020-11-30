import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tag } from './classes/tag';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class TagService {
  baseUrl: string = '/api/tag';

  constructor(private http: HttpClient) { }

  createNewTag(tag: Tag) {
    return this.http
      .put<any>(this.baseUrl + '/createNewTag', tag, httpOptions).pipe(catchError(this.handleError));
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

  getAllReviewReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report/review')
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
