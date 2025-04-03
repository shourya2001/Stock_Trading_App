import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API } from '../backend';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  constructor(private http: HttpClient) {}

  url = `${BACKEND_API}watchlist`;

  getWatchlist(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  findInWatchlist(ticker: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${ticker}`);
  }

  addToWatchlist(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  deleteFromWatchlist(ticker: string): Observable<any> {
    return this.http.delete<any>(this.url + '/' + ticker);
  }
}
