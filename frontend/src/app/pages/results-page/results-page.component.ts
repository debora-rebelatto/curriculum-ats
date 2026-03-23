import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AnalyzeService } from '../../services/analyze.service';
import { AnalyzerResult } from '../../models/analyze.model';
import { ScoreCardComponent } from '../../components/score-card/score-card.component';
import { DimensionsChartComponent } from '../../components/dimensions-chart/dimensions-chart.component';
import { KeywordsListComponent } from '../../components/keywords-list/keywords-list.component';
import { JobMatchDetailsComponent } from '../../components/job-match-details/job-match-details.component';
import { ActionSuggestionsComponent } from '../../components/action-suggestions/action-suggestions.component';
import { StrengthsListComponent } from '../../components/strengths-list/strengths-list.component';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [
    TranslateModule,
    ScoreCardComponent,
    DimensionsChartComponent,
    KeywordsListComponent,
    JobMatchDetailsComponent,
    ActionSuggestionsComponent,
    StrengthsListComponent
  ],
  templateUrl: './results-page.component.html',
})
export class ResultsPageComponent implements OnInit {
  private analyzeService = inject(AnalyzeService);
  private router = inject(Router);

  @ViewChild('resultsView', { static: false }) resultsView!: ElementRef<HTMLElement>;

  results: AnalyzerResult | null = null;

  ngOnInit(): void {
    this.results = this.analyzeService.latestResult;
    if (!this.results) {
      this.router.navigate(['/']); // Redirect if no results
    }
  }

  goBack() {
    this.analyzeService.latestResult = null;
    this.router.navigate(['/']);
  }

  exportImage() {
    const el = this.resultsView?.nativeElement;
    if (!el) return;
    html2canvas(el, { scale: 2, backgroundColor: '#f8fafc' }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'ats-analise.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  exportPDF() {
    const el = this.resultsView?.nativeElement;
    if (!el) return;
    const isDark = document.documentElement.classList.contains('dark');
    html2canvas(el, { scale: 2, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ats-analise.pdf');
    });
  }
}
