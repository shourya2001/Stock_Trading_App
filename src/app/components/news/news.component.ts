import { Component, Input, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NewsService } from '../../services/news.service';
import { NewsModalComponent } from '../news-modal/news-modal.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, NgbModule, MatCardModule, NewsModalComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  @Input('ticker') ticker = '';

  newsData: any;

  constructor(
    private newsService: NewsService,
    private modalService: NgbModal
  ) {}

  // credits: chatgpt - I want to use angular bootstrap (ng-bootstrap) to open a modal on clicking a card.

  open(data: any) {
    const modalRef = this.modalService.open(NewsModalComponent);
    modalRef.componentInstance.data = data;
    console.log(data);
  }

  setNewsData(data: any): void {
    this.newsData = data.filter((news: any) => news.image && news.headline);
  }

  ngOnInit(): void {
    this.newsService.getNews(this.ticker).subscribe((data) => {
      this.setNewsData(data);
    });
  }
}
