import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SearchbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
