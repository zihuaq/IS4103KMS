import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UtilityService } from "./utility.service"

import { MaterialResourcePosting } from '../classes/material-resource-posting';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
}

@Injectable({
  providedIn: 'root'
})
export class MrpService {

  baseUrl: string

  constructor(
    private httpClient: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + "mrp"
  }

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

  getListOfObtainedMrp(projectId: number, activityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getListOfObtainedMrp/" + projectId + "/" + activityId).pipe(
      // map((data) => {
      //   return data.map((mrp: MaterialResourcePosting) => {
      //     return {
      //       ...mrp,
      //       startDate: new Date(mrp.startDate.toString().substring(0, 20)),
      //       endDate: new Date(mrp.endDate.toString().substring(0, 20)) 
      //     }
      //   });
      // }),
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
