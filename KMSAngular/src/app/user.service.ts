import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { User } from './classes/user';
//import { getMaxListeners } from 'cluster';
import { NgForm } from '@angular/forms';
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
export class UserService {
  users: User[];
  baseUrl: string = '/api/user';

  constructor(
    private sessionService: SessionService,
    private http: HttpClient
  ) {
    this.users = this.sessionService.getUsers();

    if (this.users == null) {
      this.users = new Array();

      let user: User;

      //user = new User(1, "Yi", "Ren", date, "F", "yiren@gmail.com", password, "", "Singapore", 10, "", date, date);
      //this.users.push(user);
    }
  }

  userRegistration(newUser: User) {
    return this.http
      .put<any>(this.baseUrl + '/userRegistration', newUser, httpOptions)
      .pipe(catchError(this.handleError));
  }

  login(email: String, password: String) {
    return this.http
      .get<any>(
        this.baseUrl + '/userLogin?email=' + email + '&password=' + password
      )
      .pipe(catchError(this.handleError));
  }

  getUser(userId: String) {
    return this.http
      .get<any>(this.baseUrl + '/' + userId)
      .pipe(catchError(this.handleError));
  }

  addSkillsToProfile(userId: number, skillTags: Tag[]): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/addskills/' + userId, skillTags, httpOptions).pipe(catchError(this.handleError));
  }

  removeSkillFromProfile(userId: number, tagId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/removeskill/' + userId +'/' + tagId).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
      errorMessage =
        'A HTTP error has occurred: ' +
        `HTTP ${error.status}: ${error.error.message}`;
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
