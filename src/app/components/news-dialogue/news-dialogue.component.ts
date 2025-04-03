import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-news-dialogue',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    NgbModalModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './news-dialogue.component.html',
  styleUrl: './news-dialogue.component.css',
})
export class NewsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  shareOnTwitter() {
    const text = encodeURIComponent(`${this.data.headline} ${this.data.url}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank');
  }

  shareOnFacebook() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      this.data.url
    )}`;
    window.open(facebookUrl, '_blank');
  }
}
