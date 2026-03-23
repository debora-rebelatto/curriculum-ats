import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AnalyzeService } from '../services/analyze.service';

export const resultsGuard: CanActivateFn = (route, state) => {
  const analyzeService = inject(AnalyzeService);
  const router = inject(Router);

  if (!analyzeService.latestResult) {
    return router.parseUrl('/');
  }

  return true;
};
