import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from './classes/post';
import { PostComment } from './classes/post-comment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PostService {
  baseUrl: string = '/api/post';

  constructor(private http: HttpClient) { }

  createPost(post: Post) {
    return this.http.post<any>(this.baseUrl, post, httpOptions)
      .pipe(map(this.parsePostDate), catchError(this.handleError));
  }

  deletePostById(postId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/post/' + postId)
      .pipe(catchError(this.handleError));
  }

  likePost(userId: number, postId: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/likePost/' + userId + '/' + postId, httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeLikeForPost(userId: number, postId: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/removeLikeForPost/' + userId + '/' + postId, httpOptions)
      .pipe(catchError(this.handleError));
  }

  addCommentForPost(postId: number, comment: PostComment): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/addComment/' + postId, comment, httpOptions)
      .pipe(catchError(this.handleError));
  }

  likeComment(userId: number, commentId: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/likeComment/' + userId + '/' + commentId, httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeLikeForComment(userId: number, commentId: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/removeLikeForComment/' + userId + '/' + commentId, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/comment/' + commentId)
      .pipe(catchError(this.handleError));
  }

  getPostForUserNewsfeed(userId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/userNewsFeed/' + userId)
      .pipe(map((data) => {
        // return data.map((post) => {this.parsePostDate})
        return data.map((post) => {
          if (post.editDate) {
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
                )),
              editDate: new Date(
                Date.UTC(
                  post.editDate.substring(0, 4),
                  post.editDate.substring(5, 7) - 1,
                  post.editDate.substring(8, 10),
                  post.editDate.substring(11, 13),
                  post.editDate.substring(14, 16),
                  post.editDate.substring(17, 19)
                ))
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
          } else {
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
                ))
            }
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
          }
        })
      }), catchError(this.handleError));
  }

  private parsePostDate(post: any) {
    if (post.editDate) {
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
          )),
        editDate: new Date(
          Date.UTC(
            post.editDate.substring(0, 4),
            post.editDate.substring(5, 7) - 1,
            post.editDate.substring(8, 10),
            post.editDate.substring(11, 13),
            post.editDate.substring(14, 16),
            post.editDate.substring(17, 19)
          )),
      };
    } else {
      console.log("here")
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
          ))
      }
    }
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