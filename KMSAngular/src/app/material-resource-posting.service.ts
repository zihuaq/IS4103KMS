import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MaterialResourcePosting } from './classes/material-resource-posting';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MaterialResourcePostingService {

  baseUrl: string = '/api/mrp';

  constructor(private httpClient: HttpClient) { }

  getMrpByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getMrpByProject/" + projectId).pipe(
      map((data) => {
        return data.map((mrp: MaterialResourcePosting) => {
          var startDate: string = mrp.startDate.toString();
          mrp.startDate = new Date(startDate.slice(0, startDate.indexOf("[")));
          
          if (mrp.endDate) {
            var endDate: string = mrp.endDate.toString();
            mrp.endDate = new Date(endDate.slice(0, endDate.indexOf("[")));
          }
          return mrp;
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

  getListOfAvailableMrp(projectId: number, activityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getListOfAvailableMrp/" + projectId + "/" + activityId).pipe(
      catchError(this.handleError)
    );
  }

  getAllMaterialResourcePosting(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getAllMaterialResourcePosting").pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    console.log(error);
    if (error.error instanceof ErrorEvent) {
        errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
        errorMessage = 'An HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error.message}`;
    }
    return throwError(errorMessage)
  }
}
