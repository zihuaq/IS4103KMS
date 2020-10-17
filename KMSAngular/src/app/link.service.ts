import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Link } from './classes/link';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  baseUrl: string = '/api/link';

  constructor(private httpClient: HttpClient) { }

  getLinksByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getLinksByProject/" + projectId).pipe(
      catchError(this.handleError)
    );
  }

  createNewLink(newLink: Link): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl+"/createNewLink", newLink, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteLink(linkId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteLink/" + linkId).pipe(
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
