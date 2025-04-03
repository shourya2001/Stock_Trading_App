import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  map,
  startWith,
  debounceTime,
  switchMap,
  tap,
  finalize,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// import { AnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SearchStateService } from '../../services/search-state.service';

const BACKEND_API = 'http://localhost:3000/';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HttpClientModule,
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  tickerFormControl = new FormControl();
  filteredOptions!: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchStateService: SearchStateService
  ) {}

  isLoading = false;

  ngOnInit() {
    this.searchStateService.getSearchInput().subscribe((lastSearch) => {
      if (lastSearch !== null) {
        this.tickerFormControl.setValue(lastSearch);
      }
    });

    this.filteredOptions = this.tickerFormControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      tap(() => (this.isLoading = true)),
      switchMap((value) => {
        if (!value) {
          this.isLoading = false;
          return of([]);
        }
        return this._filter(value).pipe(
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  private _filter(value: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${BACKEND_API}search?q=${value}`)
      .pipe(map((response) => (response ? response : [])));
  }

  clearInput(event: Event) {
    event.stopPropagation();
    this.tickerFormControl.setValue('');
    this.searchStateService.clearSearchInput();
    this.router.navigate(['/search/home']);
  }

  onSubmit() {
    this.searchStock(this.tickerFormControl.value);
  }

  onOptionSelected(event: any) {
    this.searchStock(event.option.value);
  }

  searchStock(ticker: string) {
    if (ticker) {
      this.router.navigate([`/search/${ticker}`]);
    }
  }
}
