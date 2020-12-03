import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Fulfillment } from '../classes/fulfillment';
import { Payment } from '../classes/payment';
import { UtilityService } from './utility.service';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseUrl: string

  constructor(
    private httpClient: HttpClient,
    private utilityService: UtilityService
  ) {
    this.baseUrl = this.utilityService.getRootPath() + "payment"
  }

  getPayment(paymentId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/" + paymentId).pipe(
      catchError(this.handleError)
    );
  }

  createNewPayment(newPayment: Payment, fulfillmentId: number): Observable<any> {
    let createPaymentReq = {
      "newPayment": newPayment,
      "fulfillmentId": fulfillmentId
    }

    return this.httpClient.put<any>(this.baseUrl+"/createNewPayment", createPaymentReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  makePayment(fulfillmentToUpdate: Fulfillment, paymentIds: number[], paypalOrderId: string) {
    let makePaymentReq = {
      "fulfillmentToUpdate": fulfillmentToUpdate,
      "paymentIds": paymentIds,
      "paypalOrderId": paypalOrderId
    }

    return this.httpClient.post<any>(this.baseUrl + "/makePayment", makePaymentReq, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getListOfOutstandingPaymentsByProject(projectId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getListOfOutstandingPaymentsByProject/" + projectId).pipe(
      catchError(this.handleError)
    );
  }

  getListOfNotCompletedPaymentsByFulfillmentNewestToOldest(fulfillmentId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/getListOfNotCompletedPaymentsByFulfillmentNewestToOldest/" + fulfillmentId).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    console.log(error);
    if (error.error instanceof ErrorEvent) {
        errorMessage = 'An unknown error has occurred: ' + error.error.message;
    } else {
        errorMessage = 'An HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error.message}`;
    }
    return throwError(errorMessage)
  }

}
