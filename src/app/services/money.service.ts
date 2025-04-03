import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API } from '../backend';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  constructor(private http: HttpClient) {}

  getMoney(): Observable<any>{
    return this.http.get<any>(`${BACKEND_API}money`)
  }


}
