import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dependency } from './classes/dependency';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DependencyService {

  baseUrl: string = '/api/dependency';

  constructor(private httpClient: HttpClient) { }

  getDependenciesByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getDependenciesByProject/" + projectId).pipe(
      catchError(this.handleError)
    );
  }

  createNewDependency(newDependency: Dependency): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl+"/createNewDependency", newDependency, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteDependency(dependencyId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteDependency/" + dependencyId).pipe(
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
