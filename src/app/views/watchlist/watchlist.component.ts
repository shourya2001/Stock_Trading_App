import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WatchlistService } from '../../services/watchlist.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent implements OnInit {
  constructor(private watchlistService: WatchlistService) {}

  data!: any;
  isLoading: boolean = true;
  isEmpty: boolean = false;

  setData(data: Observable<[]>): void {
    this.data = data;
  }

  setIsLoading(): void {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.watchlistService.getWatchlist().subscribe((data) => {
      if (data.length === 0) {
        this.isEmpty = true;
      } else {
        this.setData(data);
      }
      this.isLoading = false;
    });
  }

  // write a function in the component which sends delete request to the backend
  deleteStock(ticker: string): void {
    this.watchlistService.deleteFromWatchlist(ticker).subscribe({
      next: (response) => {
        this.data = this.data.filter((stock: any) => stock.ticker !== ticker);
        if (this.data.length === 0) {
          this.isEmpty = true;
        }
      },
      error: (error) => {
        console.error('Error deleting the stock:', error);
      },
    });
  }
}
