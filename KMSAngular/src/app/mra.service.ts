import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MaterialResourceAvailable } from './classes/material-resource-available';

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
      .get<any>(this.baseUrl + '/' + mraId)
      .pipe(catchError(this.handleError));
  }

  updateMaterialResourceAvailable(
    updatedMra: MaterialResourceAvailable
  ): Observable<any> {
    return this.http.put<any>(this.baseUrl, updatedMra, httpOptions).pipe(
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

  createMaterialResourceAvailable(
    mra: MaterialResourceAvailable
  ): Observable<any> {
    return this.http.post<any>(this.baseUrl, mra, httpOptions).pipe(
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

  deleteMaterialResourceAvailable(
    userId: number,
    mraId: number
  ): Observable<any> {
    console.log('delete method called');
    return this.http
      .delete<any>(this.baseUrl + '/' + userId + '/' + mraId)
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

  getMaterialResourceAvailable(userId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/user/' + userId).pipe(
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
