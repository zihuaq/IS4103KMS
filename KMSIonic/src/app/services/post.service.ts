import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from '../classes/post';
import { PostComment } from '../classes/post-comment';
import { UtilityService } from './utility.service';
import { SharePostToProjectOrGroupsReq } from '../models/SharePostToProjectOrGroupsReq';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + 'post';
  }

  createPost(post: Post) {
    return this.http
      .post<any>(this.baseUrl, post, httpOptions)
      .pipe(map(this.parsePostDate), catchError(this.handleError));
  }

  updatePost(post: Post) {
    return this.http
      .put<any>(this.baseUrl, post, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deletePostById(postId: number): Observable<any> {
    return this.http
      .delete<any>(this.baseUrl + '/post/' + postId)
      .pipe(catchError(this.handleError));
  }

  likePost(userId: number, postId: number): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/likePost/' + userId + '/' + postId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeLikeForPost(userId: number, postId: number): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/removeLikeForPost/' + userId + '/' + postId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  addCommentForPost(postId: number, comment: PostComment): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/addComment/' + postId, comment, httpOptions)
      .pipe(
        map((data) => {
          return data.map((postComment) => {
            console.log(postComment);
            return {
              ...postComment,
              dateTime: new Date(
                Date.UTC(
                  postComment.dateTime.substring(0, 4),
                  postComment.dateTime.substring(5, 7) - 1,
                  postComment.dateTime.substring(8, 10),
                  postComment.dateTime.substring(11, 13),
                  postComment.dateTime.substring(14, 16),
                  postComment.dateTime.substring(17, 19)
                )
              )
            };
          });
        }),
        catchError(this.handleError)
      );
  }

  likeComment(userId: number, commentId: number): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/likeComment/' + userId + '/' + commentId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeLikeForComment(userId: number, commentId: number): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/removeLikeForComment/' + userId + '/' + commentId,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http
      .delete<any>(this.baseUrl + '/comment/' + commentId)
      .pipe(catchError(this.handleError));
  }

  updateComment(comment: PostComment): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + '/updateComment/', comment, httpOptions)
      .pipe(catchError(this.handleError));
  }

  sharePost(
    postToShareId: number,
    userId: number,
    post: Post
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/sharePost/' + postToShareId + '/' + userId,
        post,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  sharePostToProjects(
    postToShareId: number,
    userId: number,
    shareReq: SharePostToProjectOrGroupsReq
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/sharePostToProjects/' + postToShareId + '/' + userId,
        shareReq
      )
      .pipe(catchError(this.handleError));
  }

  sharePostToGroups(
    postToShareId: number,
    userId: number,
    shareReq: SharePostToProjectOrGroupsReq
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/sharePostToGroups/' + postToShareId + '/' + userId,
        shareReq
      )
      .pipe(catchError(this.handleError));
  }

  getCommentsForPost(postId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/postComments/' + postId).pipe(
      map((data) => {
        return data.map((postComment) => {
          console.log(postComment);
          return {
            ...postComment,
            dateTime: new Date(
              Date.UTC(
                postComment.dateTime.substring(0, 4),
                postComment.dateTime.substring(5, 7) - 1,
                postComment.dateTime.substring(8, 10),
                postComment.dateTime.substring(11, 13),
                postComment.dateTime.substring(14, 16),
                postComment.dateTime.substring(17, 19)
              )
            )
          };
        });
      }),
      catchError(this.handleError)
    );
  }

  shareGroupToProjects(
    userId: number,
    shareReq: SharePostToProjectOrGroupsReq,
    groupId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/shareGroupToProjects/' + userId + '/' + groupId,
        shareReq
      )
      .pipe(catchError(this.handleError));
  }

  shareGroupToGroups(
    userId: number,
    shareReq: SharePostToProjectOrGroupsReq,
    groupId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/shareGroupToGroups/' + userId + '/' + groupId,
        shareReq
      )
      .pipe(catchError(this.handleError));
  }

  shareGroupToFollowers(
    userId: number,
    post: Post,
    groupId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/shareGroupToFollowers/' + userId + '/' + groupId,
        post
      )
      .pipe(catchError(this.handleError));
  }

  shareProjectToProjects(
    userId: number,
    shareReq: SharePostToProjectOrGroupsReq,
    projectId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/shareProjectToProjects/' + userId + '/' + projectId,
        shareReq
      )
      .pipe(catchError(this.handleError));
  }

  shareProjectToGroups(
    userId: number,
    shareReq: SharePostToProjectOrGroupsReq,
    projectId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/shareProjectToGroups/' + userId + '/' + projectId,
        shareReq
      )
      .pipe(catchError(this.handleError));
  }

  shareProjectToFollowers(
    userId: number,
    post: Post,
    projectId: number
  ): Observable<any> {
    return this.http
      .put<any>(
        this.baseUrl + '/shareProjectToFollowers/' + userId + '/' + projectId,
        post
      )
      .pipe(catchError(this.handleError));
  }

  getPostForUserNewsfeed(userId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/userNewsFeed/' + userId).pipe(
      map((data) => {
        // return data.map((post) => {this.parsePostDate})
        return data.map((post) => {
          post = {
            ...post,
            postDate: new Date(
              Date.UTC(
                post.postDate.substring(0, 4),
                post.postDate.substring(5, 7) - 1,
                post.postDate.substring(8, 10),
                post.postDate.substring(11, 13),
                post.postDate.substring(14, 16),
                post.postDate.substring(17, 19)
              )
            )
          };
          post.comments.map((postComment) => {
            return {
              ...postComment,
              dateTime: new Date(
                Date.UTC(
                  postComment.dateTime.substring(0, 4),
                  postComment.dateTime.substring(5, 7) - 1,
                  postComment.dateTime.substring(8, 10),
                  postComment.dateTime.substring(11, 13),
                  postComment.dateTime.substring(14, 16),
                  postComment.dateTime.substring(17, 19)
                )
              )
            };
          });
          if (post.originalPost) {
            post.originalPost = {
              ...post.originalPost,
              postDate: new Date(
                Date.UTC(
                  post.originalPost.postDate.substring(0, 4),
                  post.originalPost.postDate.substring(5, 7) - 1,
                  post.originalPost.postDate.substring(8, 10),
                  post.originalPost.postDate.substring(11, 13),
                  post.originalPost.postDate.substring(14, 16),
                  post.originalPost.postDate.substring(17, 19)
                )
              )
            };
          }
          return post;
        });
      }),
      catchError(this.handleError)
    );
  }

  getPostById(postId: number) {
    return this.http.get<any>(this.baseUrl + '/' + postId).pipe(
      map((post) => {
        post = {
          ...post,
          postDate: new Date(
            Date.UTC(
              post.postDate.substring(0, 4),
              post.postDate.substring(5, 7) - 1,
              post.postDate.substring(8, 10),
              post.postDate.substring(11, 13),
              post.postDate.substring(14, 16),
              post.postDate.substring(17, 19)
            )
          )
        };
        post.comments.map((postComment) => {
          return {
            ...postComment,
            dateTime: new Date(
              Date.UTC(
                postComment.dateTime.substring(0, 4),
                postComment.dateTime.substring(5, 7) - 1,
                postComment.dateTime.substring(8, 10),
                postComment.dateTime.substring(11, 13),
                postComment.dateTime.substring(14, 16),
                postComment.dateTime.substring(17, 19)
              )
            )
          };
        });
        return post;
      }),
      catchError(this.handleError)
    );
  }

  getPostCommentById(commentId: number) {
    return this.http.get<any>(this.baseUrl + '/comment/' + commentId).pipe(
      map((postComment) => {
        return {
          ...postComment,
          dateTime: new Date(
            Date.UTC(
              postComment.dateTime.substring(0, 4),
              postComment.dateTime.substring(5, 7) - 1,
              postComment.dateTime.substring(8, 10),
              postComment.dateTime.substring(11, 13),
              postComment.dateTime.substring(14, 16),
              postComment.dateTime.substring(17, 19)
            )
          )
        };
      }),
      catchError(this.handleError)
    );
  }

  getPostForProjectNewsfeed(projectId: number): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + '/projectNewsFeed/' + projectId)
      .pipe(
        map((data) => {
          // return data.map((post) => {this.parsePostDate})
          return data.map((post) => {
            post = {
              ...post,
              postDate: new Date(
                Date.UTC(
                  post.postDate.substring(0, 4),
                  post.postDate.substring(5, 7) - 1,
                  post.postDate.substring(8, 10),
                  post.postDate.substring(11, 13),
                  post.postDate.substring(14, 16),
                  post.postDate.substring(17, 19)
                )
              )
            };
            post.comments.map((postComment) => {
              return {
                ...postComment,
                dateTime: new Date(
                  Date.UTC(
                    postComment.dateTime.substring(0, 4),
                    postComment.dateTime.substring(5, 7) - 1,
                    postComment.dateTime.substring(8, 10),
                    postComment.dateTime.substring(11, 13),
                    postComment.dateTime.substring(14, 16),
                    postComment.dateTime.substring(17, 19)
                  )
                )
              };
            });
            if (post.originalPost) {
              post.originalPost = {
                ...post.originalPost,
                postDate: new Date(
                  Date.UTC(
                    post.originalPost.postDate.substring(0, 4),
                    post.originalPost.postDate.substring(5, 7) - 1,
                    post.originalPost.postDate.substring(8, 10),
                    post.originalPost.postDate.substring(11, 13),
                    post.originalPost.postDate.substring(14, 16),
                    post.originalPost.postDate.substring(17, 19)
                  )
                )
              };
            }
            return post;
          });
        }),
        catchError(this.handleError)
      );
  }

  getPostForGroupNewsfeed(groupId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/groupNewsFeed/' + groupId).pipe(
      map((data) => {
        // return data.map((post) => {this.parsePostDate})
        return data.map((post) => {
          post = {
            ...post,
            postDate: new Date(
              Date.UTC(
                post.postDate.substring(0, 4),
                post.postDate.substring(5, 7) - 1,
                post.postDate.substring(8, 10),
                post.postDate.substring(11, 13),
                post.postDate.substring(14, 16),
                post.postDate.substring(17, 19)
              )
            )
          };
          post.comments.map((postComment) => {
            return {
              ...postComment,
              dateTime: new Date(
                Date.UTC(
                  postComment.dateTime.substring(0, 4),
                  postComment.dateTime.substring(5, 7) - 1,
                  postComment.dateTime.substring(8, 10),
                  postComment.dateTime.substring(11, 13),
                  postComment.dateTime.substring(14, 16),
                  postComment.dateTime.substring(17, 19)
                )
              )
            };
          });
          if (post.originalPost) {
            post.originalPost = {
              ...post.originalPost,
              postDate: new Date(
                Date.UTC(
                  post.originalPost.postDate.substring(0, 4),
                  post.originalPost.postDate.substring(5, 7) - 1,
                  post.originalPost.postDate.substring(8, 10),
                  post.originalPost.postDate.substring(11, 13),
                  post.originalPost.postDate.substring(14, 16),
                  post.originalPost.postDate.substring(17, 19)
                )
              )
            };
          }
          return post;
        });
      }),
      catchError(this.handleError)
    );
  }

  private parsePostDate(post: any) {
    return {
      ...post,
      postDate: new Date(
        Date.UTC(
          post.postDate.substring(0, 4),
          post.postDate.substring(5, 7) - 1,
          post.postDate.substring(8, 10),
          post.postDate.substring(11, 13),
          post.postDate.substring(14, 16),
          post.postDate.substring(17, 19)
        )
      )
    };
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
