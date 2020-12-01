import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilityService } from "./utility.service";

import { Notification } from '../classes/notification';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseUrl: string

  constructor(
    private httpClient: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + "notification"
  }

  getNotification(userId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getNotification/" + userId).pipe();
  }

  createNewNotification(newNotification: Notification, userId: number): Observable<any> {
    let createNotificationReq = {
      "newNotification": newNotification,
      "userId": userId
    }

    return this.httpClient.put<any>(this.baseUrl + "/createNewNotification", createNotificationReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteNotification(notificationId: number) {
    return this.httpClient.delete(this.baseUrl + "/deleteNotification/" + notificationId).pipe(
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
