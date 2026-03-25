import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyzeService } from '../../services/analyze.service';
import { SourceToggleComponent } from '../../components/source-toggle/source-toggle.component';
import { PdfUploadComponent } from '../../components/pdf-upload/pdf-upload.component';
import { JobDetailsFormComponent } from '../../components/job-details-form/job-details-form.component';
import { AlertMessageComponent } from '../../components/alert-message/alert-message.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { TextPasteComponent } from '../../components/text-paste/text-paste.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'upload-page',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    SourceToggleComponent,
    PdfUploadComponent,
    JobDetailsFormComponent,
    AlertMessageComponent,
    PrimaryButtonComponent,
    LoadingSpinnerComponent,
    TextPasteComponent,
  ],
  templateUrl: './upload-page.component.html',
})
export class UploadPageComponent {
  private analyzeService = inject(AnalyzeService);
  private router = inject(Router);

  activeTab: 'upload' | 'paste' = 'upload';
  fileName: string | null = null;
  resumeText: string = '';
  pdfBase64: string | null = null;
  jdText: string = '';
  roleText: string = '';
  errorBox: string | null = null;
  viewMode: 'form-view' | 'loading-view' = 'form-view';
  loadingMsgIndex: number = 0;
  loadingInterval: any;

  switchTab(tab: 'upload' | 'paste') {
    this.activeTab = tab;
  }

  handleFile(event: { file: File; base64: string; name: string }) {
    this.fileName = event.name;
    this.pdfBase64 = event.base64;
  }

  startLoading() {
    this.viewMode = 'loading-view';
    this.loadingMsgIndex = 1;
    let counter = 1;
    this.loadingInterval = setInterval(() => {
      counter = counter >= 5 ? 1 : counter + 1;
      this.loadingMsgIndex = counter;
    }, 4000);
  }

  stopLoading() {
    this.viewMode = 'form-view';
    clearInterval(this.loadingInterval);
  }

  async analyze() {
    this.errorBox = null;
    if (this.activeTab === 'upload' && !this.pdfBase64) {
      this.errorBox = 'error.missingPdf';
      return;
    }
    if (this.activeTab === 'paste' && !this.resumeText.trim()) {
      this.errorBox = 'error.missingText';
      return;
    }

    this.startLoading();

    try {
      const b64 = this.activeTab === 'upload' ? this.pdfBase64 : null;
      const rText = this.activeTab === 'paste' ? this.resumeText : '';
      await this.analyzeService.analyzeResume(
        b64,
        rText,
        this.jdText,
        this.roleText
      );

      this.stopLoading();
      this.router.navigate(['/results']);
    } catch (err: any) {
      console.error(err);
      this.stopLoading();
      this.errorBox = err.message || 'error.analysisFailed';
    }
  }
}
