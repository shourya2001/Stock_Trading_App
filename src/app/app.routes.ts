import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { DetailsComponent } from './views/details/details.component';
import { WatchlistComponent } from './views/watchlist/watchlist.component';
import { PortfolioComponent } from './views/portfolio/portfolio.component';

export const routes: Routes = [
    {path:'search/home', component: HomeComponent},
    {path:'search/:ticker', component: DetailsComponent},
    {path:'watchlist', component: WatchlistComponent},
    {path:'portfolio', component: PortfolioComponent},
    {path: '', redirectTo:'/search/home', pathMatch: 'full'},
];
