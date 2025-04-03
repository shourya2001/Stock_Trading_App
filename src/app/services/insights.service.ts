import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API } from '../backend';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  constructor(private http: HttpClient) {}

  getRecommendations(ticker: string): Observable<any> {
    const url = `${BACKEND_API}recommendations/${ticker}`;
    return this.http.get<any>(url);
  }

  getEarnings(ticker: string): Observable<any> {
    const url = `${BACKEND_API}earnings/${ticker}`;
    return this.http.get<any>(url);
  }

  getSentiments(ticker: string): Observable<any> {
    const url = `${BACKEND_API}sentiments/${ticker}`;
    return this.http.get<any>(url);
  }
}
