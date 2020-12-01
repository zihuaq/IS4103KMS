import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Fulfillment } from './classes/fulfillment';
import { Payment } from './classes/payment';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FulfillmentService {

  baseUrl: string = '/api/fulfillment';

  constructor(private httpClient: HttpClient) { }

  createNewFulfillment(newFulfillment: Fulfillment, ownerId: number, postingId: number, mraId: number): Observable<any> {
    let createFulfillmentReq = {
      "newFulfillment": newFulfillment,
      "ownerId": ownerId,
      "postingId": postingId,
      "mraId": mraId
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewFulfillment", createFulfillmentReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getFulfillment(fulfillmentId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/" + fulfillmentId).pipe(
      catchError(this.handleError)
    );
  }

  getFulfillmentsByMrp(mrpId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getFulfillmentsByMrp/" + mrpId).pipe(
      catchError(this.handleError)
    );
  }

  receiveResource(fulfillmentToUpdate: Fulfillment, payment: Payment) {
    let makeOneTimePaymentReq = {
      "fulfillmentToUpdate": fulfillmentToUpdate,
      "payment": payment
    }

    return this.httpClient.post<any>(this.baseUrl + "/receiveResource", makeOneTimePaymentReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateQuantity(fulfillmentToUpdate: Fulfillment, payment: Payment) {
    let makeOneTimePaymentReq = {
      "fulfillmentToUpdate": fulfillmentToUpdate,
      "payment": payment
    }

    return this.httpClient.post<any>(this.baseUrl + "/updateQuantity", makeOneTimePaymentReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateFulfillment(fulfillmentToUpdate: Fulfillment) {
    return this.httpClient.post<any>(this.baseUrl + "/updateFulfillment", fulfillmentToUpdate, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  rejectFulfillment(fulfillmentId: number) {
    return this.httpClient.post<any>(this.baseUrl + "/rejectFulfillment", fulfillmentId, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  acceptFulfillment(fulfillmentId: number) {
    return this.httpClient.post<any>(this.baseUrl + "/acceptFulfillment", fulfillmentId, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  endSubscription(fulfillmentId: number) {
    return this.httpClient.post<any>(this.baseUrl + "/endSubscription", fulfillmentId, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteFulfillment(fulfillmentId: number): Observable<any> {
    return this.httpClient.delete<any>(this.baseUrl + "/deleteFulfillment/" + fulfillmentId).pipe(
      catchError(this.handleError)
    );
  }

  getListOfFulfillmentsByUserAndProject(userId: number, projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getListOfFulfillmentsByUserAndProject/" + userId + "/" + projectId).pipe(
      catchError(this.handleError)
    );
  }

  getListOfFulfillmentsByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getListOfFulfillmentsByProject/" + projectId).pipe(
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
