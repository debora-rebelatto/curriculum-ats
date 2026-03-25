import { Component, inject, signal, OnInit } from '@angular/core';

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
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'upload-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
  private fb = inject(FormBuilder);

  activeTab: 'upload' | 'paste' = 'upload';
  fileName: string | null = null;
  errorBox: string | null = null;
  isLoading = signal(false);

  uploadForm = this.fb.nonNullable.group({
    resumeText: ['', Validators.required],
    pdfBase64: ['', Validators.required],
    jdText: [''],
    roleText: [''],
  });

  switchTab(tab: 'upload' | 'paste') {
    this.activeTab = tab;
  }

  handleFile(event: { file: File; base64: string; name: string }) {
    this.fileName = event.name;
    this.uploadForm.patchValue({ pdfBase64: event.base64 });
  }

  async analyze() {
    const { resumeText, pdfBase64, jdText, roleText } = this.uploadForm.getRawValue();

    if (this.activeTab === 'upload' && !pdfBase64) {
      this.errorBox = 'error.missingPdf';
      return;
    }
    if (this.activeTab === 'paste' && !resumeText.trim()) {
      this.errorBox = 'error.missingText';
      return;
    }

    this.isLoading.set(true);

    try {
      const b64 = this.activeTab === 'upload' ? pdfBase64 : null;
      const rText = this.activeTab === 'paste' ? resumeText : '';
      await this.analyzeService.analyzeResume(
        b64,
        rText,
        jdText,
        roleText
      );

      this.router.navigate(['/results']);
    } catch (err: any) {
      console.error(err);
      this.errorBox = err.message || 'error.analysisFailed';
    } finally {
      this.isLoading.set(false);
    }
  }
}
