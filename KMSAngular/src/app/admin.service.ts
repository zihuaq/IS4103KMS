import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { User } from './classes/user';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Tag } from './classes/tag';
import { Router } from '@angular/router';
import { UserType } from './classes/user-type.enum';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl: string = '/api/Admin';
  loggedIn = false;
  user = new Subject<User>();

  constructor(
    private sessionService: SessionService,
    private http: HttpClient,
    private router: Router
  ) { }

  changeUserStatus(
    adminEmail: String,
    userEmail: String,
    isActive: Boolean
  ): Observable<any> {
    let ChangeUserStatusReq = {
      adminEmail: adminEmail,
      userEmail: userEmail,
      isActive: isActive
    };

    return this.http
      .post<any>(
        this.baseUrl + '/changeUserStatus',
        ChangeUserStatusReq,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  promoteUserToAdmin(userIdToPromote: number) {
    return this.http
      .put<any>(this.baseUrl + '/promoteUserToAdmin/' + userIdToPromote, httpOptions)
      .pipe(catchError(this.handleError));
  }

  resignFromAdmin(userId: number) {
    return this.http
      .put<any>(this.baseUrl + '/resignFromAdmin/' + userId, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
      errorMessage = error.error.error;
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
