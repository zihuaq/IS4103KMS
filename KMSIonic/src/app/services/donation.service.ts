import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UtilityService } from './utility.service';
import { Donation } from 'src/app/classes/donation';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
}

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  baseUrl: string

  constructor(
    private httpClient: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + "donation"
  }

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
