import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Donation } from './classes/donation';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  baseUrl: string = '/api/donation';

  constructor(private httpClient: HttpClient) { }

  createNewDonation(newDonation: Donation, userId: number, projectId: number): Observable<any> {
    let createDonationReq = {
      "newDonation": newDonation,
      "userId": userId,
      "projectId": projectId
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewDonation", createDonationReq, httpOptions).pipe(
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
