import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
// import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgbModule,
    CommonModule,
    // MDBBootstrapModule,
    // MdbCollapseModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private stateService: StateService,
    private router: Router, 
    private searchStateService: SearchStateService
  ) {}

  collapsed = true;
  params: string = 'home';

  ngOnInit(): void {
    if (this.stateService.getState()) {
      this.params = this.stateService.getTicker();
    }
    // this.params = this.service.id_num;
    if (this.params == '') {
      this.params = 'home';
    }
  }

  removeActive() {
    this.params = 'home';
    const anchors = this.el.nativeElement.querySelectorAll('a');
    anchors.forEach((anchor: HTMLElement) => {
      this.renderer.removeClass(anchor, 'phase-active');
    });
  }

  toggleSearch() {
    this.params = 'home';
    const anchors = this.el.nativeElement.querySelectorAll('a');
    anchors.forEach((anchor: HTMLElement) => {
      this.renderer.removeClass(anchor, 'phase-active');
    });
    var temp_button = document.getElementById('search_button') as HTMLElement;
    temp_button.classList.add('phase-active');
    this.searchStateService.getSearchInput().subscribe((ticker) => {
      if (ticker) {
        this.router.navigate([`/search/${ticker}`]);
      } else {
        // If there's no last searched ticker, navigate to the search home or another default route
        this.router.navigate(['/search/home']);
      }
    });
  }

  toggleWatch() {
    this.params = this.stateService.getTicker();
    const anchors = this.el.nativeElement.querySelectorAll('a');
    anchors.forEach((anchor: HTMLElement) => {
      this.renderer.removeClass(anchor, 'phase-active');
    });
    var temp_button = document.getElementById('watch_button') as HTMLElement;
    temp_button.classList.add('phase-active');
  }

  togglePort() {
    this.params = this.stateService.getTicker();
    const anchors = this.el.nativeElement.querySelectorAll('a');
    anchors.forEach((anchor: HTMLElement) => {
      this.renderer.removeClass(anchor, 'phase-active');
    });
    var temp_button = document.getElementById('port_button') as HTMLElement;
    temp_button.classList.add('phase-active');
  }
}
