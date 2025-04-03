import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API } from '../backend';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  url = `${BACKEND_API}portfolio`;

  getPortfolio() {
    return this.http.get<any>(this.url);
  }

  findInPortfolio(ticker: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${ticker}`);
  }

  buyStock(data: any) {
    return this.http.post<any>(`${this.url}/buy`, data);
  }

  sellStock(data: any) {
    return this.http.post<any>(`${this.url}/sell`, data);
  }
}
