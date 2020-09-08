import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService {
    baseUrl: string = '/api/Tag';

    constructor(private http: HttpClient){ } 

//    getTags(): Observable<any> {
//        return this.http.get<any>(this.baseUrl);
//    }

}