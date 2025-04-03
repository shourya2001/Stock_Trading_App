import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [],
  templateUrl: './news-modal.component.html',
  styleUrl: './news-modal.component.css',
})
export class NewsModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
  data: any = {};


  // credits: chatgpt - ts function to convert unix timestamp to format: "September 15, 2022"
  convertUnixTimestampToDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  }

  // credits: chatgpt - I want to use angular bootstrap (ng-bootstrap) to open a modal on clicking a card.
  dismiss() {
    this.activeModal.dismiss();
  }

  
}
