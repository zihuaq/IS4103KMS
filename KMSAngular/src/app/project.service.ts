import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string = '/api/project';

  constructor(private sessionService: SessionService, private httpClient: HttpClient) { }
}
