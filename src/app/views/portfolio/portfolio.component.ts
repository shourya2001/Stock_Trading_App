import { Component, OnInit, ViewChild } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TransactionDialogueComponent } from '../../components/transaction-dialogue/transaction-dialogue.component';
import { MoneyService } from '../../services/money.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterLink,
    HttpClientModule,
    NgbModule,
    TransactionDialogueComponent,
    NgbAlert,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit {
  constructor(
    private portfolioService: PortfolioService,
    private moneyService: MoneyService,
    // public dialog: MatDialog,
    private modalService: NgbModal
  ) {}

  data!: any;
  isLoading: boolean = true;
  isEmpty: boolean = false;
  money: number = 0;
  alertMessage: string = '';
  buySuccess: boolean = false;
  sellSuccess: boolean = false;

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

  setData(data: any): void {
    this.data = data;
  }

  openTransactionDialog(stock: any, action: 'buy' | 'sell'): void {
    const modalRef = this.modalService.open(TransactionDialogueComponent, {
      size: 'lg',
    });

    modalRef.componentInstance.data = {
      ...stock,
      action,
      money: this.money,
      // quantity: this.quantity,
    };

    modalRef.closed.subscribe((result: any) => {
      if (result?.success) {
        if (result.action === 'buy') {
          this.alertMessage = ` ${result.name} bought successfully`;
          this.buySuccess = true;
        }
        if (result.action === 'sell') {
          this.alertMessage = ` ${result.name} sold successfully`;
          this.sellSuccess = true;
        }
        setTimeout(() => this.selfClosingAlert?.close(), 5000);
        this.ngOnInit();
      }
    });
  }
  // }

  ngOnInit(): void {
    console.log(this.data);
    this.portfolioService.getPortfolio().subscribe((data) => {
      if (data.length === 0) {
        this.isEmpty = true;
      } else {
        this.setData(data);
      }
      this.isLoading = false;
    });

    this.moneyService.getMoney().subscribe((data) => (this.money = data.money));
  }
}
