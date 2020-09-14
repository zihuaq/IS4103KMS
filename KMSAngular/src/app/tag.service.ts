import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class TagService {
  baseUrl: string = '/api/tag';

  constructor(private http: HttpClient) { }

  getAllSkillTags(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/skill');
  }

  getAllMaterialResourceTags(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/materialresource');
  }

  getAllSDGTags(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/sdg');
  }
}