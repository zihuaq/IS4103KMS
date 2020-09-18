import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MaterialResourceAvailable } from './classes/material-resource-available'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MaterialResourceAvailableService {
  baseUrl: string = '/api/mra';

  constructor(private http: HttpClient) {}

  getMaterialResourceAvailableById(mraId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/'+ mraId)
      .pipe(catchError(this.handleError));
  }
  
  updateMaterialResourceRequest(updatedMra: MaterialResourceAvailable) {
    return this.http
      .put<any>(this.baseUrl + '/update', updatedMra, httpOptions)
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
