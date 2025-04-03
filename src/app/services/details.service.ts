import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Quote } from '../interfaces/quote';

import { BACKEND_API } from '../backend';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  private stockDataSubject = new BehaviorSubject<any>(null);

  constructor(public http: HttpClient) {}

  getStockDetails(ticker: string): Observable<any> {
    const currentData = this.stockDataSubject.value;
    if (currentData && currentData.ticker === ticker) {
      return of(currentData); // Return the cached data as an observable
    }
    const url = `${BACKEND_API}details/${ticker}`;
    return this.http
      .get<any>(url)
      .pipe(tap((data) => this.stockDataSubject.next(data)));
  }

  getQuote(ticker: string): Observable<any> {
    const url = `${BACKEND_API}quote/${ticker}`;
    return this.http.get<any>(url);
  }

  getPeers(ticker: string): Observable<any> {
    const url = `${BACKEND_API}peers/${ticker}`;
    return this.http.get<any>(url);
  }

  getCurrentStockDetails(): any {
    return this.stockDataSubject.value;
  }

  // private stockDetailsSubject = new BehaviorSubject<any>(null);

  // setStockDetails(details: any) {
  //   this.stockDetailsSubject.next(details);
  // }

}
