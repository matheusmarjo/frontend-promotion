import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', loadChildren: () => import('./pages/home/home.routes').then(m => m.HOME_ROUTES) },
    { path: 'detail', loadChildren: () => import('./pages/detail-promo/detail-promo.routes').then(m => m.DETAILPROMO_ROUTES) },
];
