import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';

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
import { StrengthsListComponent } from '../../components/strengths-list/strengths-list.component';
import { SuggestionsListComponent } from '../../components/suggestions-list/suggestions-list.component';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [
    NgClass,
    TranslateModule,
    ScoreCardComponent,
    DimensionsChartComponent,
    KeywordsListComponent,
    JobMatchDetailsComponent,
    SuggestionsListComponent,
    StrengthsListComponent
  ],
  templateUrl: './results-page.component.html',
})
export class ResultsPageComponent implements OnInit {
  private analyzeService = inject(AnalyzeService);
  private router = inject(Router);

  @ViewChild('resultsView', { static: false }) resultsView!: ElementRef<HTMLElement>;

  results: AnalyzerResult | null = null;
  isExporting = false;

  ngOnInit(): void {
    this.results = this.analyzeService.latestResult;
  }

  goBack() {
    this.analyzeService.latestResult = null;
    this.router.navigate(['/']);
  }

  exportImage() {
    const el = this.resultsView?.nativeElement;
    if (!el) return;

    this.isExporting = true;
    setTimeout(() => {
      html2canvas(el, {
        scale: 2,
        backgroundColor: '#181a22',
        windowWidth: 1200,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'ats-analise.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        this.isExporting = false;
      }).catch(() => this.isExporting = false);
    }, 150);
  }

  exportPDF() {
    const el = this.resultsView?.nativeElement;
    if (!el) return;

    this.isExporting = true;
    setTimeout(() => {
      html2canvas(el, {
        scale: 2,
        backgroundColor: '#181a22',
        windowWidth: 1200,
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('ats-analise.pdf');
        this.isExporting = false;
      }).catch(() => this.isExporting = false);
    }, 150);
  }
}
