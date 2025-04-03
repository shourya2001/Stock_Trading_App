import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_API } from '../backend';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNews(ticker:string){
    return this.http.get<any>(`${BACKEND_API}news/${ticker}`)
  }
}