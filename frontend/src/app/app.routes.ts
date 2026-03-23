import { Routes } from '@angular/router';
import { resultsGuard } from './guards/results.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/upload-page/upload-page.component').then(m => m.UploadPageComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results-page/results-page.component').then(m => m.ResultsPageComponent),
    canActivate: [resultsGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
