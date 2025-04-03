import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_API } from '../backend';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private http: HttpClient) { }

  getChartsData(ticker: string): Observable<any> {
    return this.http.get<any>(`${BACKEND_API}history/${ticker}`);
  }

  getHourlyChartsData(ticker: string): Observable<any> {
    return this.http.get<any>(`${BACKEND_API}hourly/${ticker}`);
  }
}
