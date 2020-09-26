import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class TagService {
  baseUrl: string = '/api/tag';

  constructor(private http: HttpClient) {}

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

  getAllReportTags(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/report')
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
