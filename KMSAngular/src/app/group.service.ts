import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SessionService } from './session.service';

import { Group } from './classes/group';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  baseUrl: string = '/api/group';

  constructor(private sessionService: SessionService, private httpClient: HttpClient) { }

  getAllGroup(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/getAllGroup").pipe();
  }

  createNewGroup(newGroup: Group, ownerId: number, tagIdsSelected: number[]): Observable<any> {
    let createGroupReq = {
      "newGroup": newGroup,
      "ownerId": ownerId,
      "tagIds": tagIdsSelected
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewGroup", createGroupReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getGroupById(groupId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl+"/" + groupId).pipe(
      catchError(this.handleError)
    );
  }

  joinGroup(groupId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/joinGroup/"+groupId+"/"+userId, null).pipe(
      catchError(this.handleError)
    );
  }

  removeMember(groupId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeMember/"+groupId+"/"+userId, null).pipe(
      catchError(this.handleError)
    );
  }

  addAdmin(groupId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/addGroupAdmin/"+groupId+"/"+userId, null).pipe(
      catchError(this.handleError)
    );
  }

  removeAdmin(groupId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/removeAdmin/"+groupId+"/"+userId, null).pipe(
      catchError(this.handleError)
    );
  }

  changeOwner(groupId: number, userId: number) {
    return this.httpClient.post<any>(this.baseUrl+"/changeGroupOwner/"+groupId+"/"+userId, null).pipe(
      catchError(this.handleError)
    );
  }

  deleteGroup(groupId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteGroup/"+groupId).pipe(
      catchError(this.handleError)
    );
  }

  updateGroup(GroupToUpdate: Group) {
    return this.httpClient.post<any>(this.baseUrl + "/update", GroupToUpdate, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // getGroupStatusList(): Observable<any> {
  //   return this.httpClient.get<any>(this.baseUrl+"/getGroupStatusList").pipe();
  // }

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
