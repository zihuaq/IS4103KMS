import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Project } from './classes/project';
import { SessionService } from './session.service';
import { MaterialResourcePosting } from './classes/material-resource-posting';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MaterialResourcePostingService {

  baseUrl: string = '/api/mrp';

  constructor(private sessionService: SessionService, private httpClient: HttpClient) { }

  getMrpByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getMrpByProject/" + projectId).pipe(
      map((data) => {
        return data.map((mrp: MaterialResourcePosting) => {
          return {
            ...mrp,
            startDate: new Date(
              parseInt(mrp.startDate.toString().substring(0, 4)),
              parseInt(mrp.startDate.toString().substring(5, 7)) - 1,
              parseInt(mrp.startDate.toString().substring(8, 10)),
              parseInt(mrp.startDate.toString().substring(11, 13)),
              parseInt(mrp.startDate.toString().substring(14, 16)),
              parseInt(mrp.startDate.toString().substring(17, 19))
            ),
            endDate: new Date(
              parseInt(mrp.endDate.toString().substring(0, 4)),
              parseInt(mrp.endDate.toString().substring(5, 7)) - 1,
              parseInt(mrp.endDate.toString().substring(8, 10)),
              parseInt(mrp.endDate.toString().substring(11, 13)),
              parseInt(mrp.endDate.toString().substring(14, 16)),
              parseInt(mrp.endDate.toString().substring(17, 19))
            ),
          }
        });
      }),
      catchError(this.handleError)
    );
  }

  getMrp(mrpId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/" + mrpId).pipe(
      catchError(this.handleError)
    );
  }

  createNewMrp(newMrp: MaterialResourcePosting, projectId: number, tagIds: number[]): Observable<any> {
    let createMrpReq = {
      "newMrp": newMrp,
      "projectId": projectId,
      "tagIds": tagIds
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewMrp", createMrpReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateMrp(mrpToUpdate: MaterialResourcePosting) {
    return this.httpClient.post<any>(this.baseUrl + "/updateMrp", mrpToUpdate, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteMrp(mrpId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteMrp/" + mrpId).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    
    if (error.error instanceof ErrorEvent) {
        errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
        errorMessage = 'An HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error.message}`;
    }
    return throwError(errorMessage)
  }
}
