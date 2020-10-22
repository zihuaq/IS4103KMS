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
export class UserService {
  baseUrl: string = '/api/user';
  loggedIn = false;
  user = new Subject<User>();

  constructor(
    private sessionService: SessionService,
    private http: HttpClient,
    private router: Router
  ) {}

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

  resetPassword(email: String) {
    return this.http
      .post<any>(this.baseUrl + '/resetPassword?email=' + email, null)
      .pipe(catchError(this.handleError));
  }

  getUser(userId: String) {
    return this.http
      .get<any>(this.baseUrl + '/' + userId)
      .pipe(map(this.parseUserDate), catchError(this.handleError));
  }

  getAllUsers(): Observable<any> {
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
      .get<any>(this.baseUrl + '/followrequestmade/' + userId)
      .pipe(catchError(this.handleError));
  }

  getFollowRequestReceived(userId: number) {
    return this.http
      .get<any>(this.baseUrl + '/followrequestreceived/' + userId)
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
      .get<any>(this.baseUrl + '/skills/' + userId)
      .pipe(catchError(this.handleError));
  }

  getSDGsForProfile(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/getSDG/' + userId)
      .pipe(catchError(this.handleError));
  }

  addSDGToProfile(userId: number, sdgTags: Tag[]): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/addSDG/' + userId, sdgTags, httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeSDGFromProfile(userId: number, tagId: number): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/removeSDG/' + userId + '/' + tagId, null)
      .pipe(catchError(this.handleError));
  }

  getAffiliatedUsers(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/affiliated/' + userId)
      .pipe(catchError(this.handleError));
  }

  makeAffiliationRequests(
    userId: number,
    toUserIds: number[]
  ): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/affiliated/' + userId, toUserIds)
      .pipe(catchError(this.handleError));
  }

  sendAffiliateReqToUser(
    userId: number,
    affiliatedUserToAddId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/addaffiliated/' + userId + '/' + affiliatedUserToAddId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeAffiliatedUser(
    userId: number,
    affiliatedUserToRemoveId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl +
          '/removeaffiliated/' +
          userId +
          '/' +
          affiliatedUserToRemoveId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAffiliationRequestMade(userId: number) {
    return this.http
      .get<any>(this.baseUrl + '/affiliationrequestmade/' + userId)
      .pipe(catchError(this.handleError));
  }

  getAffiliationRequestReceived(userId: number) {
    return this.http
      .get<any>(this.baseUrl + '/affiliationrequestreceived/' + userId)
      .pipe(catchError(this.handleError));
  }

  acceptAffiliation(toUserId: number, fromUserId: number) {
    return this.http
      .post<any>(
        this.baseUrl + '/acceptaffiliation/' + toUserId + '/' + fromUserId,
        null
      )
      .pipe(catchError(this.handleError));
  }

  rejectAffiliation(toUserId: number, fromUserId: number) {
    return this.http
      .post<any>(
        this.baseUrl + '/rejectaffiliation/' + toUserId + '/' + fromUserId,
        null
      )
      .pipe(catchError(this.handleError));
  }

  updateUser(updatedUser: User) {
    return this.http
      .post<any>(this.baseUrl + '/update', updatedUser, httpOptions)
      .pipe(map(this.parseUserDate), catchError(this.handleError));
  }

  getFollowers(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/followers/' + userId)
      .pipe(catchError(this.handleError));
  }

  getFollowing(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/following/' + userId)
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

  deleteUser(userId: number): Observable<any> {
    return this.http
      .delete<any>(this.baseUrl + '/deleteUser/' + userId)
      .pipe(catchError(this.handleError));
  }

  private parseUserDate(data: any) {
    if (data.userType == UserType.ADMIN) {
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
        // adminStartDate: new Date(
        //   Date.UTC(
        //     data.adminStartDate.substring(0, 4),
        //     data.adminStartDate.substring(5, 7) - 1,
        //     data.adminStartDate.substring(8, 10),
        //     data.adminStartDate.substring(11, 13),
        //     data.adminStartDate.substring(14, 16),
        //     data.adminStartDate.substring(17, 19)
        //   )
        // ),
      };
    } else if (data.userType == UserType.INDIVIDUAL) {
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
    } else if (data.userType == UserType.INSTITUTE) {
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
      };
    }
  }

  updateCustomerPassword(
    email: String,
    oldPassword: String,
    newPassword: String
  ): Observable<any> {
    let updateUserPasswordReq = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    return this.http
      .post<any>(
        this.baseUrl + '/updateUserPassword',
        updateUserPasswordReq,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }



  verifyEmail(email: String, uuid: String) {
    return this.http
      .get<any>(this.baseUrl + '/verifyEmail?email=' + email + '&uuid=' + uuid)
      .pipe(catchError(this.handleError));
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      resolve(this.sessionService.getIsLogin());
    });
    return promise;
  }

  isAdmin() {
    const promise = new Promise((resolve, reject) => {
      resolve(this.sessionService.getIsLogin() && this.sessionService.getIsAdmin);
    });
    return promise;
  }

  logout(): void {
    this.cleanup();
    this.router.navigate(['/login']);
  }

  private cleanup(): void {
    this.sessionService.setIsLogin(false);
    this.sessionService.setIsAdmin(false);
    this.sessionService.setCurrentUser(null);
    this.user.next(null);
    this.loggedIn = false;
  }

  getProjectsOwned(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "/projectsOwned/" + userId)
      .pipe(catchError(this.handleError));
  }

  getProjectsJoined(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "/viewOwnProjects/" + userId)
      .pipe(catchError(this.handleError));
  }

  getProjectsManaged(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + "/projectsManaged/" + userId)
      .pipe(catchError(this.handleError));
  }

  getGroupsOwned(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + /groupsOwned/ + userId)
      .pipe(catchError(this.handleError));
  }

  getGroupsJoined(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + /viewOwnGroups/ + userId)
      .pipe(catchError(this.handleError));
  }

  getGroupsManaged(userId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + /groupsManaged/ + userId)
      .pipe(catchError(this.handleError));
  }


  getRecievedReviews(userId: number): Observable<any>{
    return this.http.get<any>(this.baseUrl + /receivedreviews/ + userId)
    .pipe(catchError(this.handleError));
  }

  getWrittenReviews(userId: number): Observable<any>{
    return this.http.get<any>(this.baseUrl + /writtenreviews/ + userId)
    .pipe(catchError(this.handleError));
  }
}

