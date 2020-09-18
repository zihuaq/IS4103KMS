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
import { catchError, map } from 'rxjs/operators';
import { Tag } from './classes/tag';
import { MaterialResourceAvailable } from './classes/material-resource-available';

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
      .pipe(map(this.parseDate), catchError(this.handleError));
  }

  getAllUsers() {
    return this.http
      .get<any>(this.baseUrl + '/allusers')
      .pipe(catchError(this.handleError));
  }

  followUser(toUserId: String, fromUserId: String) {
    return this.http
      .post<any>(this.baseUrl + '/follow/' + toUserId + '/' + fromUserId, null)
      .pipe(catchError(this.handleError));
  }

  unfollowUser(toUserId: String, fromUserId: String) {
    return this.http
      .post<any>(
        this.baseUrl + '/unfollow/' + toUserId + '/' + fromUserId,
        null
      )
      .pipe(catchError(this.handleError));
  }

  acceptFollow(toUserId: number, fromUserId: number) {
    return this.http
      .post<any>(
        this.baseUrl + '/acceptfollow/' + toUserId + '/' + fromUserId,
        null
      )
      .pipe(catchError(this.handleError));
  }

  rejectFollow(toUserId: number, fromUserId: number) {
    return this.http
      .post<any>(
        this.baseUrl + '/rejectfollow/' + toUserId + '/' + fromUserId,
        null
      )
      .pipe(catchError(this.handleError));
  }

  getFollowRequestMade(userId: number) {
    return this.http
      .get<any>(this.baseUrl + /followrequestmade/ + userId)
      .pipe(catchError(this.handleError));
  }

  getFollowRequestReceived(userId: number) {
    return this.http
      .get<any>(this.baseUrl + /followrequestreceived/ + userId)
      .pipe(catchError(this.handleError));
  }

  addSkillsToProfile(userId: number, skillTags: Tag[]): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/addskills/' + userId, skillTags, httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeSkillFromProfile(userId: number, tagId: number): Observable<any> {
    return this.http
      .delete<any>(this.baseUrl + '/removeskill/' + userId + '/' + tagId)
      .pipe(catchError(this.handleError));
  }

  getSkillsForProfile(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + /skills/ + userId)
      .pipe(catchError(this.handleError));
  }

  updateUser(updatedUser: User) {
    return this.http
      .post<any>(this.baseUrl + '/update', updatedUser, httpOptions)
      .pipe(map(this.parseDate), catchError(this.handleError));
  }

  createMaterialResourceAvailable(
    mra: MaterialResourceAvailable
  ): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/mra', mra, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteMaterialResourceAvailable(
    userId: number,
    mraId: number
  ): Observable<any> {
    console.log('delete method called');
    return this.http
      .delete<any>(this.baseUrl + '/mra/' + userId + '/' + mraId)
      .pipe(catchError(this.handleError));
  }

  getMaterialResourceAvailable(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/mra/' + userId)
      .pipe(catchError(this.handleError));
  }

  getFollowers(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + /followers/ + userId)
      .pipe(catchError(this.handleError));
  }

  getFollowing(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + /following/ + userId)
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

  private parseDate(data: any) {
    if (data.isAdmin) {
      return {
        ...data,
        joinedDate: new Date(
          Date.UTC(
            data.joinedDate.substring(0, 4),
            data.joinedDate.substring(5, 7) - 1,
            data.joinedDate.substring(8, 10),
            data.joinedDate.substring(11, 13),
            data.joinedDate.substring(14, 16),
            data.joinedDate.substring(17, 19)
          )
        ),
        dob: new Date(
          Date.UTC(
            data.dob.substring(0, 4),
            data.dob.substring(5, 7) - 1,
            data.dob.substring(8, 10),
            data.dob.substring(11, 13),
            data.dob.substring(14, 16),
            data.dob.substring(17, 19)
          )
        ),
        adminStartDate: new Date(
          Date.UTC(
            data.adminStartDate.substring(0, 4),
            data.adminStartDate.substring(5, 7) - 1,
            data.adminStartDate.substring(8, 10),
            data.adminStartDate.substring(11, 13),
            data.adminStartDate.substring(14, 16),
            data.adminStartDate.substring(17, 19)
          )
        ),
      };
    } else {
      return {
        ...data,
        joinedDate: new Date(
          Date.UTC(
            data.joinedDate.substring(0, 4),
            data.joinedDate.substring(5, 7) - 1,
            data.joinedDate.substring(8, 10),
            data.joinedDate.substring(11, 13),
            data.joinedDate.substring(14, 16),
            data.joinedDate.substring(17, 19)
          )
        ),
        dob: new Date(
          Date.UTC(
            data.dob.substring(0, 4),
            data.dob.substring(5, 7) - 1,
            data.dob.substring(8, 10),
            data.dob.substring(11, 13),
            data.dob.substring(14, 16),
            data.dob.substring(17, 19)
          )
        ),
      };
    }
  }
}
