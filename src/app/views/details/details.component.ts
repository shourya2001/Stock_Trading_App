import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { map, switchMap, startWith } from 'rxjs/operators';
import { DetailsService } from '../../services/details.service';
import { SearchStateService } from '../../services/search-state.service';
import { PortfolioService } from '../../services/portfolio.service';
import { WatchlistService } from '../../services/watchlist.service';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { NgbModule, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Observable, interval, timer } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NewsComponent } from '../../components/news/news.component';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogueComponent } from '../../components/transaction-dialogue/transaction-dialogue.component';
import { MoneyService } from '../../services/money.service';
import { InsightsComponent } from '../../components/insights/insights.component';
import { SummaryComponent } from '../../components/summary/summary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartsComponent } from '../../components/charts/charts.component';
import { ChartsService } from '../../services/charts.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    MatIconModule,
    SearchbarComponent,
    NewsComponent,
    InsightsComponent,
    SummaryComponent,
    MatTabsModule,
    ChartsComponent,
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  ticker: string | null = null;
  stockDetails!: any;
  quote: any = {};
  timer15: any;
  isMarketClosed: boolean = true;
  marketCloseTime: string = '';
  peers: any = [];
  portfolioStocks: any;
  watchlistStocks: any;
  isInPortfolio: boolean = false;
  isInWatchlist: boolean = false;
  isValid: boolean = true;
  portfolioAlertMessage: string = '';
  buySuccess: boolean = false;
  sellSuccess: boolean = false;
  addedToWatchlist: boolean = false;
  removedFromWatchlist: boolean = false;
  watchlistAlertMessage: string = '';
  money: number = 0;
  quantity: number = 0;
  ohlc: any = [];
  volume: any = [];

  constructor(
    private route: ActivatedRoute,
    private detailService: DetailsService,
    private searchStateService: SearchStateService,
    private portfolioService: PortfolioService,
    private watchlistService: WatchlistService,
    private moneyService: MoneyService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private chartsService: ChartsService
  ) {}

  setQuote(data: any): void {
    this.quote = data;
    this.setIsMarketClosed(data.t);
  }

  setPeers(data: any): void {
    this.peers = data.slice(0, 8);
  }

  // credits: chatgpt: I am given a unix timestamp. write a function to check whether 5 mins passed have since that timestamp
  setIsMarketClosed(t: number): void {
    const currentTime = Date.now(); // Current time in milliseconds
    const inputTime = t * 1000; // Convert input Unix timestamp from seconds to milliseconds
    const differenceInMinutes = (currentTime - inputTime) / (1000 * 60); // Convert milliseconds to minutes
    this.isMarketClosed = differenceInMinutes >= 5;
    if (this.isMarketClosed) {
      this.marketCloseTime = this.convertUnixTimestampToDateTime(t);
    }
  }

  // credits: chatgpt - write a function to convert unix timestamp to a date and time string in the format "2022-09-15 12:00:00"

  convertUnixTimestampToDateTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  setStockDetails(data: any): void {
    this.stockDetails = data;
  }

  setIsInWatchlist(data: any, ticker: string = '') {
    this.isInWatchlist = false;
    const filteredWatchlist = data.filter(
      (stock: any) => ticker.toLowerCase() === stock.ticker.toLowerCase()
    );

    if (filteredWatchlist.length > 0) {
      this.isInWatchlist = true;
    }
  }

  setIsInPortfolio(data: any, ticker: string = '') {
    const filteredPortfolio = data.filter(
      (stock: any) => ticker.toLowerCase() === stock.ticker.toLowerCase()
    );

    this.quantity = 0;

    if (filteredPortfolio.length > 0) {
      this.isInPortfolio = true;
      this.quantity = filteredPortfolio[0].quantity;
    }
  }

  toggleWatchlist() {
    if (this.isInWatchlist) {
      this.watchlistService
        .deleteFromWatchlist(this.ticker || '')
        .subscribe(() => {
          this.isInWatchlist = !this.isInWatchlist;
          this.removedFromWatchlist = true;
          this.watchlistAlertMessage = ` ${this.stockDetails.name} removed from watchlist`;
        });
    } else {
      this.watchlistService
        .addToWatchlist({
          ticker: this.ticker,
          ...this.stockDetails,
        })
        .subscribe(() => {
          this.isInWatchlist = !this.isInWatchlist;
          this.addedToWatchlist = true;
          this.watchlistAlertMessage = ` ${this.stockDetails.name} added to watchlist`;
        });
    }
  }

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

  openTransactionDialog(stock: any, action: 'buy' | 'sell'): void {
    const modalRef = this.modalService.open(TransactionDialogueComponent, {
      size: 'lg',
    });
    console.log(stock)

    modalRef.componentInstance.data = {
      ...stock,
      action,
      money: this.money,
      quantity: this.quantity,
      name: this.stockDetails.name,
    };

    modalRef.closed.subscribe((result) => {
      if (result?.success) {
        if (result.action === 'buy') {
          this.portfolioAlertMessage = ` ${result.name} bought successfully`;
          this.buySuccess = true;
        }
        if (result.action === 'sell') {
          this.portfolioAlertMessage = ` ${result.name} sold successfully`;
          this.sellSuccess = true;
        }
        setTimeout(() => this.selfClosingAlert?.close(), 5000);
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map((params) => params.get('ticker')))
      .subscribe((tickerValue) => {
        this.ticker = tickerValue;
        if (this.ticker) {
          const details = this.detailService.getCurrentStockDetails(); 
          if (details && details.ticker === this.ticker) {
            this.setStockDetails(details);
          } else {
            this.searchStateService.setSearchInput(this.ticker);
            this.detailService
              .getStockDetails(this.ticker)
              .subscribe((data) => {
                if (Object.keys(data).length === 0) {
                  this.isValid = false;
                } else {
                  this.setStockDetails(data);
                }
              });
          }

          if (this.isValid && this.ticker) {
            this.timer15 = timer(0, 15000).subscribe(() => {
              this.detailService.getQuote(this.ticker!).subscribe({
                next: (data) => {
                  this.setQuote({...data, t_now: Date.now() / 1000});
                  // this.setQuote(data);
                },
                error: (err) => console.error(err),
              });
            });

            this.detailService
              .getPeers(this.ticker!)
              .subscribe((data) => this.setPeers(data));
            this.portfolioService.getPortfolio().subscribe((data) => {
              this.setIsInPortfolio(data, this.ticker || '');
            });
            this.watchlistService.getWatchlist().subscribe((data) => {
              this.setIsInWatchlist(data, this.ticker || '');
            });
            this.moneyService.getMoney().subscribe((data) => {
              this.money = data.money;
            });

            this.chartsService.getChartsData(this.ticker).subscribe({
              next: (data) => {
                this.ohlc = data.map((result: any) => [
                  result.t,
                  result.o,
                  result.h,
                  result.l,
                  result.c,
                ]);
                this.volume = data.map((result: any) => [result.t, result.v]);
              }
            })
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.timer15.unsubscribe();
  }
}
