// search-state.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  private searchInputSubject = new BehaviorSubject<string | null>(null);

  setSearchInput(input: string) {
    this.searchInputSubject.next(input);
  }

  getSearchInput(): Observable<string | null> {
    return this.searchInputSubject.asObservable();
  }

  clearSearchInput() {
    this.searchInputSubject.next(null);
  }
}
