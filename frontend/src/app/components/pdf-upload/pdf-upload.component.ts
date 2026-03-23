import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pdf-upload.component.html'
})
export class PdfUploadComponent {
  @Input() fileName: string | null = null;
  @Output() fileSelected = new EventEmitter<{ file: File; base64: string; name: string }>();

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result.split(',')[1];
      this.fileSelected.emit({ file, base64, name: file.name });
    };
    reader.readAsDataURL(file);
  }
}
