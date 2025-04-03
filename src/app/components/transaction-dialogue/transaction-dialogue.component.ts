import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PortfolioService } from '../../services/portfolio.service';
// import {}

@Component({
  selector: 'app-transaction-dialogue',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    NgbModalModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './transaction-dialogue.component.html',
  styleUrl: './transaction-dialogue.component.css',
})
export class TransactionDialogueComponent implements OnInit {
  transactionFormControl = new FormControl();

  money: number = 0;
  totalValue: number = 0;
  isValidBuy: boolean = false;
  isValidSell: boolean = false;
  displayError: boolean = false;
  errorMesssage: string = '';

  @Input() data: any = {};
  @Input() action: string = '';

  constructor(
    private portfolioService: PortfolioService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.money = this.data.money;

    this.isValidBuy = false;
    this.isValidSell = false;

    this.transactionFormControl.valueChanges.subscribe((value) => {
      this.totalValue = value * this.data.c;
      this.isValidBuy = this.totalValue <= this.data.money && value > 0;
      this.isValidSell = value <= this.data.quantity && value > 0;
      if (this.data.action === 'buy' && this.totalValue > this.data.money) {
        this.displayError = true;
        this.errorMesssage = 'Not enough money in Wallet';
      } else if (this.data.action === 'sell' && value > this.data.quantity) {
        this.displayError = true;
        this.errorMesssage = "You cannot sell the stocks you don't have";
      } else {
        this.displayError = false;
      }
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  // credits: chatgpt - On clicking on buy/sell in the portfolio for a particular stock,
  // a modal opens which allows buying or selling a stock. On buying or selling a stock I want
  // the modal to close and the portfolio page to reload the updated data and display a message
  // saying the stock (name of the stock) bought successfully
  onBuy(): void {
    const x = {
      ticker: this.data.ticker,
      quantity: this.transactionFormControl.value,
      price: this.data.c,
      name: this.data.name,
    };  
    this.portfolioService.buyStock(x).subscribe({
      next: (data) => {
        this.activeModal.close({
          action: 'buy',
          success: true,
          name: this.data.ticker,
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSell(): void {
    const transactionInfo = {
      ticker: this.data.ticker,
      quantity: this.transactionFormControl.value,
      price: this.data.c,
      name: this.data.name,
    };
    this.portfolioService.sellStock(transactionInfo).subscribe({
      next: (data) => {
        this.activeModal.close({
          action: 'sell',
          success: true,
          name: this.data.ticker,
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
